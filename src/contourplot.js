import Bokeh from '@bokeh/bokehjs';
import {button_click, split_to_columns} from "./utils";
import {Conrec} from 'ml-conrec';

function get_contour(csv, options){
    let data = csv.trim().split("\n").map(line=>line.split(",").map(el=>parseFloat(el)));
    let data2 = data.map(row=>row.slice(1,)).slice(1,);
    let xs = data[0].slice(1,);
    let ys = data.map(row=>row[0]).slice(1,);
    let c = new Conrec(data2, {xs, ys});
    options['contourDrawer'] = 'shape';
    let contour = c.drawContour(options);
    return contour;    
}

class ContourPlot{
    constructor(){
        let cmaps = Object.getOwnPropertyNames(Bokeh.Palettes).filter(item => typeof Bokeh.Palettes[item] === 'function' && item !== 'linear_palette');

        this.colormap_selector = new Bokeh.Widgets.Select({
            title:"Color Map",
            options:cmaps,
            value:cmaps[0]
        });

        this.colormap_selector.properties.value.change.connect((args, cb_obj) => {
            this.cm.palette = Bokeh.Palettes[this.colormap_selector.value](256)
        });

        this.doc = new Bokeh.Document();
        this.source = new Bokeh.ColumnDataSource({
            data:{
                xs:[],
                ys:[],
                colors:[]
            }
        });

        this.plot = Bokeh.Plotting.figure({
            output_backend: "webgl",
            width: 700,
            height: 600
        });

        this.cm = new Bokeh.LinearColorMapper({
            high:2,
            low:-2,
            palette:Bokeh.Palettes[this.colormap_selector.value](256),
        });

        this.colorbar = new Bokeh.ColorBar({
            color_mapper:this.cm
        });

        this.plot.multi_line({field:"xs"}, {field:"ys"}, {
            source: this.source,
            color:{field:"colors", transform:this.cm}
        });

        this.plot.add_layout(this.colorbar, 'right');

        this.file_button = new Bokeh.Widgets.FileInput({
            label: "File",
            accept: ".csv"
        });

        this.file_button.properties.value.change.connect((args, cb_obj) => this.plot_contour(true));
        this.nlevels_spinner = new Bokeh.Widgets.Spinner({
            title:"N levels",
            low: 3,
            high: 100,
            step: 1,
            value: 20,
        });

        this.vmin_spinner = new Bokeh.Widgets.Spinner({
            title:"Min Value",
            step: 0.1,
            value: 20,
        });        

        this.vmax_spinner = new Bokeh.Widgets.Spinner({
            title:"Max Value",
            step: 0.1,
            value: 20,
        });        

        this.plot_button = new Bokeh.Widgets.Button({
            label: "Plot",
            js_event_callbacks: button_click(this, () => this.plot_contour(false))
        });

        this.panel = new Bokeh.Column({
            children:[
                this.file_button, 
                this.nlevels_spinner, 
                this.colormap_selector, 
                this.vmin_spinner,
                this.vmax_spinner,
                this.plot_button
            ]
        });

        this.layout = new Bokeh.Row({
            children:[this.panel, this.plot]
        });
        this.doc.add_root(this.layout);
        window.source = this.source;
    }

    plot_contour(auto_range){
        let csv = atob(this.file_button.value);
        let options = {};
        if(!auto_range){
            options["levels"] = Bokeh.LinAlg.linspace(this.vmin_spinner.value, this.vmax_spinner.value, this.nlevels_spinner.value);
        }
        else{
            options["nbLevels"] = this.nlevels_spinner.value;
        }
        let contour = get_contour(csv, options);
        window.contour = contour;
        let xs = [];
        let ys = [];
        let colors = [];
        for(let c of contour){
            let x = c.xy.map(el=>el.x);
            let y = c.xy.map(el=>el.y);
            xs.push(x);
            ys.push(y);
            colors.push(c.level);
        }
        this.cm.low = Bokeh.LinAlg.min(colors);
        this.cm.high = Bokeh.LinAlg.max(colors);
        this.source.data = {xs, ys, colors};
        if(auto_range){
            this.vmin_spinner.value = this.cm.low;
            this.vmax_spinner.value = this.cm.high;
        }
    }

    show(el){
        Bokeh.embed.add_document_standalone(this.doc, el);
    }
}

export default function(id){
    let plot = new ContourPlot();
    window.contour_plot = plot;
    plot.show(document.getElementById(id));
}
