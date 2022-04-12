import Bokeh from '@bokeh/bokehjs';
import $ from 'jquery';
import line_plot from "./lineplot";
import contour_plot from './contourplot';

class Pages{
    constructor(pages){
        this.doc = new Bokeh.Document();
        this.pages = {};
        for(let key of Object.keys(pages)){
            $('<div>', {id:key}).appendTo($('div#root'));
            pages[key](key);
        }
        $('div#root > div').hide();
        this.pages = pages;
        this.labels = Object.keys(this.pages);
        this.page_widget = new Bokeh.Widgets.RadioButtonGroup({
            labels:this.labels
        });
        this.page_widget.properties.active.change.connect((args, cb_obj) => {
            let label = this.labels[this.page_widget.active]
            console.log(label);
            $('div#root > div').hide();
            $('div#' + label).show();
        });
        window.page_widget = this.page_widget;
        this.doc.add_root(this.page_widget);
    }

    show(el){
        Bokeh.embed.add_document_standalone(this.doc, el);
    }
}


let pages = new Pages({"LinePlot":line_plot, "Contour":contour_plot})
pages.show(document.getElementById("head"));