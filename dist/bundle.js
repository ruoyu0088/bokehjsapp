/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "Bokeh"
const external_Bokeh_namespaceObject = Bokeh;
var external_Bokeh_default = /*#__PURE__*/__webpack_require__.n(external_Bokeh_namespaceObject);
;// CONCATENATED MODULE: external "$"
const external_$_namespaceObject = $;
var external_$_default = /*#__PURE__*/__webpack_require__.n(external_$_namespaceObject);
;// CONCATENATED MODULE: external "Papa"
const external_Papa_namespaceObject = Papa;
var external_Papa_default = /*#__PURE__*/__webpack_require__.n(external_Papa_namespaceObject);
;// CONCATENATED MODULE: ./src/utils.js
function button_click (self, func) {
    return {
        "button_click": [{
            execute: (_obj, _data) => func.call(self)
        }]
    }
}

function split_to_columns(arr, n){
    let res = [];
    let i, j;
    for(i=0;i<n;i++){
        res.push([]);
    }
    j = 0;
    for(i=0;i<arr.length;i++){
        res[j].push(arr[i]);
        j += 1;
        if(j >= n){
            j = 0;
        }
    }
    return res;
}

;// CONCATENATED MODULE: ./src/lineplot.js





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
    let results = external_Papa_default().parse(csv, {
        header: true,
        dynamicTyping: true
    });
    return results;
};

class CsvPlot {
    constructor() {
        this.source = new (external_Bokeh_default()).ColumnDataSource({
            data: {
                x: [1, 2],
                y: [2, 3]
            }
        });

        this.plots = new (external_Bokeh_default()).Column();

        this.xaxis_widget = new (external_Bokeh_default()).Widgets.Select();
        this.columns_widget = new (external_Bokeh_default()).Widgets.MultiSelect({
            height: 200
        });

        this.file_button = new (external_Bokeh_default()).Widgets.FileInput({
            label: "File",
            accept: ".csv"
        });

        this.file_button.properties.value.change.connect((args, cb_obj) => this.on_file_changed(args, cb_obj));

        this.add_button = new (external_Bokeh_default()).Widgets.Button({
            label: "Add",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                this.group_edit.value += this.columns_widget.value.join(",") + "\n";
            })
        });

        this.plot_button = new (external_Bokeh_default()).Widgets.Button({
            label: "Plot",
            width: button_width,
            js_event_callbacks: button_click(this, () => this.plot())
        });

        this.clear_button = new (external_Bokeh_default()).Widgets.Button({
            label: "Clear",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                this.group_edit.value = '';
                this.plots.children = [];
            })
        });

        this.height_spinner = new (external_Bokeh_default()).Widgets.Spinner({
            // title:"plot height",
            low: 100,
            high: 500,
            step: 20,
            value: 200,
            width: 80
        });

        this.height_spinner.properties.value.change.connect((args, cb_obj) => {
            for (let fig of this.plots.select((external_Bokeh_default()).Plot)) {
                fig.height = this.height_spinner.value;
            }
        });

        this.group_edit = new (external_Bokeh_default()).Widgets.TextAreaInput({
            height: 150
        });

        this.name_select = new (external_Bokeh_default()).Widgets.Select({
            sizing_mode: "stretch_width"
        });

        this.load_name_button = new (external_Bokeh_default()).Widgets.Button({
            label: "Load",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                let db = load_db();
                let data = db.names[this.name_select.value];
                this.xaxis_widget.value = data.x;
                this.group_edit.value = data.y;
            })
        });

        this.add_name_button = new (external_Bokeh_default()).Widgets.Button({
            label: "Save",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                this.input_panel.visible = true;
                this.name_input.value = this.name_select.value;
                external_$_default()('div.name_input input').focus().select();
            })
        });

        this.del_name_button = new (external_Bokeh_default()).Widgets.Button({
            label: "Del",
            width: button_width,
            js_event_callbacks: button_click(this, () => {
                del_name(this.name_select.value);
                this.update_names();
            })
        });

        this.name_input = new (external_Bokeh_default()).Widgets.TextInput({
            label: "Name",
            sizing_mode: "stretch_width",
            css_classes: ['name_input'],
        });

        this.name_panel = new (external_Bokeh_default()).Row({
            children: [
                this.name_select,
                this.load_name_button,
                this.add_name_button,
                this.del_name_button
            ]
        });
        this.input_panel = new (external_Bokeh_default()).Row({
            children: [this.name_input],
            visible: false,
            height: 50
        });

        this.button_panel = new (external_Bokeh_default()).Row({
            children: [
                this.add_button,
                this.plot_button,
                this.clear_button,
                this.height_spinner
            ]
        });

        this.panel = new (external_Bokeh_default()).Column({
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
        this.layout = new (external_Bokeh_default()).Row({
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
        data['__index__'] = external_Bokeh_default().LinAlg.range(0, results.data.length);
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
        let crosshair = new (external_Bokeh_default()).CrosshairTool({
            dimensions: 'height',
            line_alpha: 0.5
        });
        let hover = new (external_Bokeh_default()).HoverTool({
            tooltips: Array.from(items).map(item => [item, '@' + item])
        });
        hover.tooltips.push([this.xaxis_widget.value, '@' + this.xaxis_widget.value]);
        let tools = ['pan', 'wheel_zoom', crosshair, hover, 'reset', 'undo', 'redo'];
        this.group_edit.value.split("\n").filter(items => items.trim()).map(items => {
            let plot = external_Bokeh_default().Plotting.figure({
                output_backend: "webgl",
                tools: tools,
                width: document.documentElement.clientWidth - 450,
                height: this.height_spinner.value
            });
            let colors = external_Bokeh_default().Palettes.Category10_10.entries();
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
        this.plots.children = [external_Bokeh_default().Plotting.gridplot(_plots.map(item => [item]), {
            toolbar_location: "right"
        })];

        for (let tool of this.plots.select((external_Bokeh_default()).WheelZoomTool)) {
            tool.active = true;
        }
    }

    show(el) {
        this.update_names();
        this.doc = new (external_Bokeh_default()).Document();
        this.doc.add_root(this.layout);
        external_Bokeh_default().embed.add_document_standalone(this.doc, el);

        external_$_default()('body').on('keyup', 'div.name_input input', e => {
            if (e.key === 'Enter') {
                this.add_name();
            }
        });
        
        external_$_default()(document).keyup(e => {
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

/* harmony default export */ function lineplot(id){
    let csv_plot = new CsvPlot();
    csv_plot.show(document.getElementById(id));
}

;// CONCATENATED MODULE: ./node_modules/ml-conrec/src/BasicContourDrawer.js
class BasicContourDrawer {
  constructor(levels, swapAxes) {
    this.contour = new Array(levels.length);
    for (let i = 0; i < levels.length; i++) {
      this.contour[i] = {
        zValue: levels[i],
        lines: [],
      };
    }
    this.swapAxes = swapAxes;
  }

  drawContour(x1, y1, x2, y2, z, k) {
    if (!this.swapAxes) {
      this.contour[k].lines.push(y1, x1, y2, x2);
    } else {
      this.contour[k].lines.push(x1, y1, x2, y2);
    }
  }

  getContour() {
    return this.contour;
  }
}

;// CONCATENATED MODULE: ./node_modules/ml-conrec/src/ContourBuilder.js
// Based on the code from https://github.com/jasondavies/conrec.js
/**
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */
// Based on the code from https://github.com/jasondavies/conrec.js
/**
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */
class ContourBuilder {
  constructor(level) {
    this.level = level;
    this.s = null;
    this.count = 0;
  }
  removeSeq(list) {
    // if list is the first item, static ptr s is updated
    if (list.prev) {
      list.prev.next = list.next;
    } else {
      this.s = list.next;
    }
    if (list.next) {
      list.next.prev = list.prev;
    }
    --this.count;
  }
  addSegment(a, b) {
    let ss = this.s;
    let ma = null;
    let mb = null;
    let prependA = false;
    let prependB = false;
    while (ss) {
      if (ma === null) {
        // no match for a yet
        if (pointsEqual(a, ss.head.p)) {
          ma = ss;
          prependA = true;
        } else if (pointsEqual(a, ss.tail.p)) {
          ma = ss;
        }
      }
      if (mb === null) {
        // no match for b yet
        if (pointsEqual(b, ss.head.p)) {
          mb = ss;
          prependB = true;
        } else if (pointsEqual(b, ss.tail.p)) {
          mb = ss;
        }
      }
      // if we matched both no need to continue searching
      if (mb !== null && ma !== null) {
        break;
      } else {
        ss = ss.next;
      }
    }
    // c is the case selector based on which of ma and/or mb are set
    let c = (ma !== null ? 1 : 0) | (mb !== null ? 2 : 0);
    let pp;
    switch (c) {
      case 0: {
        // both unmatched, add as new sequence
        let aa = { p: a, prev: null };
        let bb = { p: b, next: null };
        aa.next = bb;
        bb.prev = aa;
        // create sequence element and push onto head of main list. The order
        // of items in this list is unimportant
        ma = { head: aa, tail: bb, next: this.s, prev: null, closed: false };
        if (this.s) {
          this.s.prev = ma;
        }
        this.s = ma;
        ++this.count; // not essential - tracks number of unmerged sequences
        break;
      }
      case 1: {
        // a matched, b did not - thus b extends sequence ma
        pp = { p: b };
        if (prependA) {
          pp.next = ma.head;
          pp.prev = null;
          ma.head.prev = pp;
          ma.head = pp;
        } else {
          pp.next = null;
          pp.prev = ma.tail;
          ma.tail.next = pp;
          ma.tail = pp;
        }
        break;
      }
      case 2: {
        // b matched, a did not - thus a extends sequence mb
        pp = { p: a };
        if (prependB) {
          pp.next = mb.head;
          pp.prev = null;
          mb.head.prev = pp;
          mb.head = pp;
        } else {
          pp.next = null;
          pp.prev = mb.tail;
          mb.tail.next = pp;
          mb.tail = pp;
        }
        break;
      }
      case 3: {
        // both matched, can merge sequences
        // if the sequences are the same, do nothing, as we are simply closing this path (could set a flag)
        if (ma === mb) {
          pp = { p: ma.tail.p, next: ma.head, prev: null };
          ma.head.prev = pp;
          ma.head = pp;
          ma.closed = true;
          break;
        }
        // there are 4 ways the sequence pair can be joined. The current setting of prependA and
        // prependB will tell us which type of join is needed. For head/head and tail/tail joins
        // one sequence needs to be reversed
        switch ((prependA ? 1 : 0) | (prependB ? 2 : 0)) {
          case 0: // tail-tail
            // reverse ma and append to mb
            reverseList(ma);
          // fall through to head/tail case
          case 1: // head-tail
            // ma is appended to mb and ma discarded
            mb.tail.next = ma.head;
            ma.head.prev = mb.tail;
            mb.tail = ma.tail;
            // discard ma sequence record
            this.removeSeq(ma);
            break;
          case 3: // head-head
            // reverse ma and append mb to it
            reverseList(ma);
          // fall through to tail/head case
          case 2: // tail-head
            // mb is appended to ma and mb is discarded
            ma.tail.next = mb.head;
            mb.head.prev = ma.tail;
            ma.tail = mb.tail;
            // discard mb sequence record
            this.removeSeq(mb);
            break;
          default:
            throw new Error('UNREACHABLE');
        }
        break;
      }
      default:
        throw new Error('UNREACHABLE');
    }
  }
}

function pointsEqual(a, b) {
  let x = a.x - b.x;
  let y = a.y - b.y;
  return x * x + y * y < Number.EPSILON;
}

function reverseList(list) {
  let pp = list.head;
  let temp;
  while (pp) {
    // swap prev/next pointers
    temp = pp.next;
    pp.next = pp.prev;
    pp.prev = temp;

    // continue through the list
    pp = temp;
  }

  // swap head/tail pointers
  temp = list.head;
  list.head = list.tail;
  list.tail = temp;
}

;// CONCATENATED MODULE: ./node_modules/ml-conrec/src/ShapeContourDrawer.js
// Based on the code from https://github.com/jasondavies/conrec.js

/**
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */



class ShapeContourDrawer {
  constructor(levels, swapAxes) {
    this.contours = new Array(levels.length);
    for (let i = 0; i < levels.length; i++) {
      this.contours[i] = new ContourBuilder(levels[i]);
    }
    this.swapAxes = swapAxes;
  }

  drawContour(x1, y1, x2, y2, z, k) {
    if (!this.swapAxes) {
      this.contours[k].addSegment({ x: y1, y: x1 }, { x: y2, y: x2 });
    } else {
      this.contours[k].addSegment({ x: x1, y: y1 }, { x: x2, y: y2 });
    }
  }

  getContour() {
    let l = [];
    let a = this.contours;
    for (let k = 0; k < a.length; k++) {
      let s = a[k].s;
      let level = a[k].level;
      while (s) {
        let h = s.head;
        let l2 = [];
        l2.level = level;
        l2.k = k;
        while (h && h.p) {
          l2.push(h.p);
          h = h.next;
        }
        l.push({level:level, xy:l2});
        s = s.next;
      }
    }
    return l;
  }
}

;// CONCATENATED MODULE: ./node_modules/ml-conrec/src/calculateContour.js
// https://github.com/jasondavies/conrec.js

// Changes have been done by MLJS team

/**
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */

const EPSILON = Number.EPSILON;
const MINUSEPSILON = 0 - EPSILON;

/**
 * contour is a contouring subroutine for rectangularily spaced data
 *
 * It emits calls to a line drawing subroutine supplied by the user which
 * draws a contour map corresponding to real*4data on a randomly spaced
 * rectangular grid. The coordinates emitted are in the same units given in
 * the x() and y() arrays.
 *
 * Any number of contour levels may be specified but they must be in order of
 * increasing value.
 *
 * @private
 * @param {number[][]} matrix - matrix of data to contour
 *
 *             The following two, one dimensional arrays (x and y) contain
 *             the horizontal and vertical coordinates of each sample points.
 * @param {number[]} x  - data matrix column coordinates
 * @param {number[]} y  - data matrix row coordinates
 * @param {number[]} z  - contour levels in increasing order.
 * @param {object} contourDrawer object that implements contourDraw for drawing contour.  Defaults to a
 *                               custom "contour builder", which populates the
 *                               contours property.
 * @param {object} [options={}]
 * @param {number} [options.ilb] - index bounds of data matrix
 * @param {number} [options.iub] - index bounds of data matrix
 * @param {number} [options.jlb] - index bounds of data matrix
 * @param {number} [options.jub] - index bounds of data matrix
 */
function calculateContour(matrix, x, y, z, contourDrawer, options = {}) {
  const {
    timeout,
    ilb = 0,
    iub = matrix.length - 1,
    jlb = 0,
    jub = matrix[0].length - 1,
  } = options;
  const h = new Array(5);
  const sh = new Array(5);
  const xh = new Array(5);
  const yh = new Array(5);
  const nc = z.length;
  const z0 = z[0];
  const znc1 = z[nc - 1];

  const start = Date.now();
  /** private */
  function xsect(p1, p2) {
    return (h[p2] * xh[p1] - h[p1] * xh[p2]) / (h[p2] - h[p1]);
  }
  function ysect(p1, p2) {
    return (h[p2] * yh[p1] - h[p1] * yh[p2]) / (h[p2] - h[p1]);
  }
  let m1;
  let m2;
  let m3;
  let x1 = 0.0;
  let x2 = 0.0;
  let y1 = 0.0;
  let y2 = 0.0;

  // The indexing of im and jm should be noted as it has to start from zero
  // unlike the fortran counter part
  const im = [0, 1, 1, 0];
  const jm = [0, 0, 1, 1];
  // Note that castab is arranged differently from the FORTRAN code because
  // Fortran and C/C++ arrays are transposed of each other, in this case
  // it is more tricky as castab is in 3 dimensions
  const castab = [
    [
      [0, 0, 8],
      [0, 2, 5],
      [7, 6, 9],
    ],
    [
      [0, 3, 4],
      [1, 3, 1],
      [4, 3, 0],
    ],
    [
      [9, 6, 7],
      [5, 2, 0],
      [8, 0, 0],
    ],
  ];

  //  for (let j = jlb; j < jub; j++) {
  for (let j = jub - 1; j >= jlb; j--) {
    if (timeout && Date.now() - start > timeout) {
      throw new Error(
        `timeout: contour generation could not finish in less than ${timeout}ms`,
      );
    }
    for (let i = ilb; i < iub; i++) {
      let dij = matrix[i][j];
      let dij1 = matrix[i][j + 1];
      let di1j = matrix[i + 1][j];
      let di1j1 = matrix[i + 1][j + 1];
      let min1, min2, max1, max2;
      if (dij > dij1) {
        min1 = dij1;
        max1 = dij;
      } else {
        min1 = dij;
        max1 = dij1;
      }
      if (di1j > di1j1) {
        min2 = di1j1;
        max2 = di1j;
      } else {
        min2 = di1j;
        max2 = di1j1;
      }
      let dmin = min1 > min2 ? min2 : min1; // Math.min(temp1, temp2);
      let dmax = max1 > max2 ? max1 : max2; // Math.max(temp1, temp2);
      if (dmax >= z0 && dmin <= znc1) {
        for (let k = 0; k < nc; k++) {
          if (z[k] >= dmin && z[k] <= dmax) {
            for (let m = 4; m >= 0; m--) {
              if (m > 0) {
                // The indexing of im and jm should be noted as it has to
                // start from zero
                h[m] = matrix[i + im[m - 1]][j + jm[m - 1]] - z[k];
                xh[m] = x[i + im[m - 1]];
                yh[m] = y[j + jm[m - 1]];
              } else {
                h[0] = 0.25 * (h[1] + h[2] + h[3] + h[4]);
                xh[0] = 0.5 * (x[i] + x[i + 1]);
                yh[0] = 0.5 * (y[j] + y[j + 1]);
              }
              if (h[m] > EPSILON) {
                sh[m] = 1;
              } else if (h[m] < MINUSEPSILON) {
                sh[m] = -1;
              } else {
                sh[m] = 0;
              }
            }
            //
            // Note: at this stage the relative heights of the corners and the
            // centre are in the h array, and the corresponding coordinates are
            // in the xh and yh arrays. The centre of the box is indexed by 0
            // and the 4 corners by 1 to 4 as shown below.
            // Each triangle is then indexed by the parameter m, and the 3
            // vertices of each triangle are indexed by parameters m1,m2,and
            // m3.
            // It is assumed that the centre of the box is always vertex 2
            // though this isimportant only when all 3 vertices lie exactly on
            // the same contour level, in which case only the side of the box
            // is drawn.
            //
            //
            //      vertex 4 +-------------------+ vertex 3
            //               | \               / |
            //               |   \    m-3    /   |
            //               |     \       /     |
            //               |       \   /       |
            //               |  m=2    X   m=2   |       the centre is vertex 0
            //               |       /   \       |
            //               |     /       \     |
            //               |   /    m=1    \   |
            //               | /               \ |
            //      vertex 1 +-------------------+ vertex 2
            //
            //
            //
            //               Scan each triangle in the box
            //
            for (let m = 1; m <= 4; m++) {
              m1 = m;
              m2 = 0;
              if (m !== 4) {
                m3 = m + 1;
              } else {
                m3 = 1;
              }
              let caseValue = castab[sh[m1] + 1][sh[m2] + 1][sh[m3] + 1];
              if (caseValue !== 0) {
                switch (caseValue) {
                  case 1: // Line between vertices 1 and 2
                    x1 = xh[m1];
                    y1 = yh[m1];
                    x2 = xh[m2];
                    y2 = yh[m2];
                    break;
                  case 2: // Line between vertices 2 and 3
                    x1 = xh[m2];
                    y1 = yh[m2];
                    x2 = xh[m3];
                    y2 = yh[m3];
                    break;
                  case 3: // Line between vertices 3 and 1
                    x1 = xh[m3];
                    y1 = yh[m3];
                    x2 = xh[m1];
                    y2 = yh[m1];
                    break;
                  case 4: // Line between vertex 1 and side 2-3
                    x1 = xh[m1];
                    y1 = yh[m1];
                    x2 = xsect(m2, m3);
                    y2 = ysect(m2, m3);
                    break;
                  case 5: // Line between vertex 2 and side 3-1
                    x1 = xh[m2];
                    y1 = yh[m2];
                    x2 = xsect(m3, m1);
                    y2 = ysect(m3, m1);
                    break;
                  case 6: //  Line between vertex 3 and side 1-2
                    x1 = xh[m3];
                    y1 = yh[m3];
                    x2 = xsect(m1, m2);
                    y2 = ysect(m1, m2);
                    break;
                  case 7: // Line between sides 1-2 and 2-3
                    x1 = xsect(m1, m2);
                    y1 = ysect(m1, m2);
                    x2 = xsect(m2, m3);
                    y2 = ysect(m2, m3);
                    break;
                  case 8: // Line between sides 2-3 and 3-1
                    x1 = xsect(m2, m3);
                    y1 = ysect(m2, m3);
                    x2 = xsect(m3, m1);
                    y2 = ysect(m3, m1);
                    break;
                  case 9: // Line between sides 3-1 and 1-2
                    x1 = xsect(m3, m1);
                    y1 = ysect(m3, m1);
                    x2 = xsect(m1, m2);
                    y2 = ysect(m1, m2);
                    break;
                  default:
                    break;
                }
                // Put your processing code here and comment out the printf
                // printf("%f %f %f %f %f\n",x1,y1,x2,y2,z[k]);
                contourDrawer.drawContour(x1, y1, x2, y2, z[k], k);
              }
            }
          }
        }
      }
    }
  }
}

;// CONCATENATED MODULE: ./node_modules/ml-conrec/src/index.js




const defaultOptions = {
  nbLevels: 10,
  timeout: 0,
};

/**
 *
 * @class Conrec
 * @param {number[][]} matrix
 * @param {number[]} [options.xs]
 * @param {number[]} [options.ys]
 * @param {boolean} [options.swapAxes]
 */
class Conrec {
  constructor(matrix, options = {}) {
    const { swapAxes = false } = options;
    this.matrix = matrix;
    this.rows = matrix.length;
    this.columns = matrix[0].length;

    const optionsHasXs = options.xs !== undefined;
    const optionsHasYs = options.ys !== undefined;
    if (swapAxes) {
      // We swap axes, which means xs are in the rows direction. This is the normal
      // way for the conrec library.
      this.xs = optionsHasXs ? options.xs : range(0, this.rows, 1);
      this.ys = optionsHasYs ? options.ys : range(0, this.columns, 1);
    } else {
      // We do not swap axes, so if the user provided xs or ys, we must swap the
      // internal values so the algorithm can still work.
      this.xs = optionsHasYs ? options.ys : range(0, this.rows, 1);
      this.ys = optionsHasXs ? options.xs : range(0, this.columns, 1);
    }

    this.swapAxes = swapAxes;
    this.hasMinMax = false;
  }

  /**
   *
   * @param {number[]} [options.levels]
   * @param {number} [options.nbLevels=10]
   * @param {string} [options.contourDrawer='basic'] - 'basic' or 'shape'
   * @param {number} [options.timeout=0]
   * @return {any}
   */
  drawContour(options) {
    options = Object.assign({}, defaultOptions, options);

    let levels;
    if (options.levels) {
      levels = options.levels.slice();
    } else {
      this._computeMinMax();
      const interval = (this.max - this.min) / (options.nbLevels - 1);
      levels = range(this.min, this.max + interval, interval);
    }
    levels.sort((a, b) => a - b);

    let contourDrawer = options.contourDrawer || 'basic';
    if (typeof contourDrawer === 'string') {
      if (contourDrawer === 'basic') {
        contourDrawer = new BasicContourDrawer(levels, this.swapAxes);
      } else if (contourDrawer === 'shape') {
        contourDrawer = new ShapeContourDrawer(levels, this.swapAxes);
      } else {
        throw new Error(`unknown contour drawer: ${contourDrawer}`);
      }
    } else {
      throw new TypeError('contourDrawer must be a string');
    }

    calculateContour(this.matrix, this.xs, this.ys, levels, contourDrawer, {
      timeout: options.timeout,
    });
    return contourDrawer.getContour();
  }

  _computeMinMax() {
    if (!this.hasMinMax) {
      const r = minMax(this.matrix);
      this.min = r.min;
      this.max = r.max;
      this.hasMinMax = true;
    }
  }
}

function range(from, to, step) {
  const result = [];
  for (let i = from; i < to; i += step) result.push(i);
  return result;
}

function minMax(matrix) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] < min) min = row[j];
      if (row[j] > max) max = row[j];
    }
  }
  return {
    min,
    max,
  };
}

;// CONCATENATED MODULE: ./src/contourplot.js




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
        let cmaps = Object.getOwnPropertyNames((external_Bokeh_default()).Palettes).filter(item => typeof (external_Bokeh_default()).Palettes[item] === 'function' && item !== 'linear_palette');

        this.colormap_selector = new (external_Bokeh_default()).Widgets.Select({
            title:"Color Map",
            options:cmaps,
            value:cmaps[0]
        });

        this.colormap_selector.properties.value.change.connect((args, cb_obj) => {
            this.cm.palette = (external_Bokeh_default()).Palettes[this.colormap_selector.value](256)
        });

        this.doc = new (external_Bokeh_default()).Document();
        this.source = new (external_Bokeh_default()).ColumnDataSource({
            data:{
                xs:[],
                ys:[],
                colors:[]
            }
        });

        this.plot = external_Bokeh_default().Plotting.figure({
            output_backend: "webgl",
            width: 700,
            height: 600
        });

        this.cm = new (external_Bokeh_default()).LinearColorMapper({
            high:2,
            low:-2,
            palette:(external_Bokeh_default()).Palettes[this.colormap_selector.value](256),
        });

        this.colorbar = new (external_Bokeh_default()).ColorBar({
            color_mapper:this.cm
        });

        this.plot.multi_line({field:"xs"}, {field:"ys"}, {
            source: this.source,
            color:{field:"colors", transform:this.cm}
        });

        this.plot.add_layout(this.colorbar, 'right');

        this.file_button = new (external_Bokeh_default()).Widgets.FileInput({
            label: "File",
            accept: ".csv"
        });

        this.file_button.properties.value.change.connect((args, cb_obj) => this.plot_contour(true));
        this.nlevels_spinner = new (external_Bokeh_default()).Widgets.Spinner({
            title:"N levels",
            low: 3,
            high: 100,
            step: 1,
            value: 20,
        });

        this.vmin_spinner = new (external_Bokeh_default()).Widgets.Spinner({
            title:"Min Value",
            step: 0.1,
            value: 20,
        });        

        this.vmax_spinner = new (external_Bokeh_default()).Widgets.Spinner({
            title:"Max Value",
            step: 0.1,
            value: 20,
        });        

        this.plot_button = new (external_Bokeh_default()).Widgets.Button({
            label: "Plot",
            js_event_callbacks: button_click(this, () => this.plot_contour(false))
        });

        this.panel = new (external_Bokeh_default()).Column({
            children:[
                this.file_button, 
                this.nlevels_spinner, 
                this.colormap_selector, 
                this.vmin_spinner,
                this.vmax_spinner,
                this.plot_button
            ]
        });

        this.layout = new (external_Bokeh_default()).Row({
            children:[this.panel, this.plot]
        });
        this.doc.add_root(this.layout);
        window.source = this.source;
    }

    plot_contour(auto_range){
        let csv = atob(this.file_button.value);
        let options = {};
        if(!auto_range){
            options["levels"] = external_Bokeh_default().LinAlg.linspace(this.vmin_spinner.value, this.vmax_spinner.value, this.nlevels_spinner.value);
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
        this.cm.low = external_Bokeh_default().LinAlg.min(colors);
        this.cm.high = external_Bokeh_default().LinAlg.max(colors);
        this.source.data = {xs, ys, colors};
        if(auto_range){
            this.vmin_spinner.value = this.cm.low;
            this.vmax_spinner.value = this.cm.high;
        }
    }

    show(el){
        external_Bokeh_default().embed.add_document_standalone(this.doc, el);
    }
}

/* harmony default export */ function contourplot(id){
    let plot = new ContourPlot();
    window.contour_plot = plot;
    plot.show(document.getElementById(id));
}

;// CONCATENATED MODULE: ./src/index.js





class Pages{
    constructor(pages){
        this.doc = new (external_Bokeh_default()).Document();
        this.pages = {};
        for(let key of Object.keys(pages)){
            external_$_default()('<div>', {id:key}).appendTo(external_$_default()('div#root'));
            pages[key](key);
        }
        external_$_default()('div#root > div').hide();
        this.pages = pages;
        this.labels = Object.keys(this.pages);
        this.page_widget = new (external_Bokeh_default()).Widgets.RadioButtonGroup({
            labels:this.labels
        });
        this.page_widget.properties.active.change.connect((args, cb_obj) => {
            let label = this.labels[this.page_widget.active]
            console.log(label);
            external_$_default()('div#root > div').hide();
            external_$_default()('div#' + label).show();
        });
        window.page_widget = this.page_widget;
        this.doc.add_root(this.page_widget);
    }

    show(el){
        external_Bokeh_default().embed.add_document_standalone(this.doc, el);
    }
}


let pages = new Pages({"LinePlot":lineplot, "Contour":contourplot})
pages.show(document.getElementById("head"));
/******/ })()
;