import Bokeh from '@bokeh/bokehjs';
import $ from 'jquery';
import Papa from 'papaparse';
import { button_click } from './utils';

const key = 'time_series';
const button_width = 60;

let load_db = function () {
    let db = localStorage.getItem(key);
    if (db === null) {
        db = {
            names: {}
        };
    } else {
        db = JSON.parse(db);
    }
    return db;
};

let load_names = function () {
    let db = load_db();
    let names = db['names'];
    return (typeof names !== "undefined") ? names : {};
};

let del_name = function (name) {
    let db = load_db();
    if (db.hasOwnProperty('names')) {
        delete db.names[name];
        localStorage.setItem(key, JSON.stringify(db));
    }
};

let add_name = function (name, value) {
    let db = load_db();
    db.names[name] = value;
    localStorage.setItem(key, JSON.stringify(db));
};

let parse_csv = function (csv) {
    let results = Papa.parse(csv, {
        header: true,
        dynamicTyping: true
    });
    return results;
};

class CsvPlot {
    constructor() {
        this.source = new Bokeh.ColumnDataSource({
            data: {
                x: [1, 2],
                y: [2, 3]
            }
        });

        this.plots = new Bokeh.Column();

        this.xaxis_widget = new Bokeh.Widgets.Select();
        this.columns_widget = new Bokeh.Widgets.MultiSelect({
            height: 200
        });

        this.file_button = new Bokeh.Widgets.FileInput({
            label: "File",
            accept: ".csv"
        });

        this.file_button.properties.value.change.connect((args, cb_obj) => this.on_file_changed(args, cb_obj));

        this.add_button = new Bokeh.Widgets.Button({
            label: "Add",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                this.group_edit.value += this.columns_widget.value.join(",") + "\n";
            })
        });

        this.plot_button = new Bokeh.Widgets.Button({
            label: "Plot",
            width: button_width,
            js_event_callbacks: button_click(this, () => this.plot())
        });

        this.clear_button = new Bokeh.Widgets.Button({
            label: "Clear",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                this.group_edit.value = '';
                this.plots.children = [];
            })
        });

        this.height_spinner = new Bokeh.Widgets.Spinner({
            // title:"plot height",
            low: 100,
            high: 500,
            step: 20,
            value: 200,
            width: 80
        });

        this.height_spinner.properties.value.change.connect((args, cb_obj) => {
            for (let fig of this.plots.select(Bokeh.Plot)) {
                fig.height = this.height_spinner.value;
            }
        });

        this.group_edit = new Bokeh.Widgets.TextAreaInput({
            height: 150
        });

        this.name_select = new Bokeh.Widgets.Select({
            sizing_mode: "stretch_width"
        });

        this.load_name_button = new Bokeh.Widgets.Button({
            label: "Load",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                let db = load_db();
                let data = db.names[this.name_select.value];
                this.xaxis_widget.value = data.x;
                this.group_edit.value = data.y;
            })
        });

        this.add_name_button = new Bokeh.Widgets.Button({
            label: "Save",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                this.input_panel.visible = true;
                this.name_input.value = this.name_select.value;
                $('div.name_input input').focus().select();
            })
        });

        this.del_name_button = new Bokeh.Widgets.Button({
            label: "Del",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                del_name(this.name_select.value);
                this.update_names();
            })
        });

        this.name_input = new Bokeh.Widgets.TextInput({
            label: "Name",
            sizing_mode: "stretch_width",
            css_classes: ['name_input'],
        });

        this.name_panel = new Bokeh.Row({
            children: [
                this.name_select,
                this.load_name_button,
                this.add_name_button,
                this.del_name_button
            ]
        });
        this.input_panel = new Bokeh.Row({
            children: [this.name_input],
            visible: false,
            height: 50
        });

        this.button_panel = new Bokeh.Row({
            children: [
                this.add_button,
                this.plot_button,
                this.clear_button,
                this.height_spinner
            ]
        });

        this.panel = new Bokeh.Column({
            width: 400,
            children: [
                this.file_button,
                this.columns_widget,
                this.button_panel,
                this.xaxis_widget,
                this.group_edit,
                this.name_panel,
                this.input_panel
            ]
        });
        this.layout = new Bokeh.Row({
            children: [this.panel, this.plots]
        });
    }

    on_file_changed(args, cb_obj) {
        let csv = atob(cb_obj.value);
        let results = parse_csv(csv);
        let fields = ['__index__'].concat(results.meta.fields);
        this.columns_widget.options = fields;
        this.xaxis_widget.options = fields;
        this.xaxis_widget.value = fields[0];
        let data = {};
        for (let field of results.meta.fields) {
            data[field] = results.data.map(row => row[field]);
        }
        data['__index__'] = Bokeh.LinAlg.range(0, results.data.length);
        this.source.data = data;
    }

    update_names() {
        let names = load_names();
        this.name_select.options = Object.keys(names);
        if (this.name_select.options.length > 0) {
            this.name_select.value = this.name_select.options[0];
        }
    }

    plot() {
        let items = new Set(this.group_edit.value.split("\n").map(line => line.split(",")).flat(2)
            .map(item => item.trim()).filter(item => item));
        window.items = items;
        let _plots = [];
        let crosshair = new Bokeh.CrosshairTool({
            dimensions: 'height',
            line_alpha: 0.5
        });
        let hover = new Bokeh.HoverTool({
            tooltips: Array.from(items).map(item => [item, '@' + item])
        });
        hover.tooltips.push([this.xaxis_widget.value, '@' + this.xaxis_widget.value]);
        let tools = ['pan', 'wheel_zoom', crosshair, hover, 'reset', 'undo', 'redo'];
        this.group_edit.value.split("\n").filter(items => items.trim()).map(items => {
            let plot = Bokeh.Plotting.figure({
                output_backend: "webgl",
                tools: tools,
                width: document.documentElement.clientWidth - 450,
                height: this.height_spinner.value
            });
            let colors = Bokeh.Palettes.Category10_10.entries();
            items.split(",").map(item => {
                item = item.trim();
                plot.line({
                    field: this.xaxis_widget.value
                }, {
                    field: item
                }, {
                    source: this.source,
                    legend_label: item,
                    color: colors.next().value[1]
                });
            });
            _plots.push(plot);
        });
        for (let _plot of _plots) {
            _plot.x_range = _plots[0].x_range;
        }
        this.plots.children = [Bokeh.Plotting.gridplot(_plots.map(item => [item]), {
            toolbar_location: "right"
        })];

        for (let tool of this.plots.select(Bokeh.WheelZoomTool)) {
            tool.active = true;
        }
    }

    show(el) {
        this.update_names();
        this.doc = new Bokeh.Document();
        this.doc.add_root(this.layout);
        Bokeh.embed.add_document_standalone(this.doc, el);

        $('body').on('keyup', 'div.name_input input', e => {
            if (e.key === 'Enter') {
                this.add_name();
            }
        });
        
        $(document).keyup(e => {
            if (e.key === "Escape") {
                if (this.input_panel.visible) {
                    this.input_panel.visible = false;
                }
            }
        });        
    }

    add_name() {
        if (this.input_panel.visible) {
            add_name(this.name_input.value, {
                x: this.xaxis_widget.value,
                y: this.group_edit.value
            });
            this.update_names();
            this.input_panel.visible = false;
        }
    }
}

export default function(id){
    let csv_plot = new CsvPlot();
    csv_plot.show(document.getElementById(id));
}
