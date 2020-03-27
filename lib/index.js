"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const echarts_1 = __importDefault(require("echarts"));
const canvas_1 = require("canvas");
const jsdom_1 = require("jsdom");
class Chart {
    constructor(width, height) {
        this.width = 800;
        this.height = 600;
        this.canvas = null;
        this.chart = null;
        const { window } = new jsdom_1.JSDOM();
        global['window'] = window;
        global['navigator'] = window.navigator;
        global['document'] = window.document;
        this.width = width;
        this.height = height;
        this.canvas = canvas_1.createCanvas(width, height);
        this.canvas.width = width;
        this.canvas.height = height;
        this.chart = echarts_1.default.init(this.canvas);
    }
    getChartSize() {
        return { width: this.width, height: this.height };
    }
    renderChart(option) {
        this.chart.setOption(option);
    }
    renderToStream(option, type = 'png') {
        this.chart.setOption(option);
        this.chart.dispose();
        switch (type) {
            case 'png': return this.canvas.createPNGStream();
            case 'jpg': return this.canvas.createJPEGStream();
            case 'pdf': return this.canvas.createPDFStream();
        }
    }
    renderToBuffer(option) {
        this.renderChart(option);
        return new Promise((resolve, reject) => {
            this.canvas.toBuffer((error, buffer) => {
                this.chart.dispose();
                if (error)
                    return reject(error);
                return resolve(buffer);
            });
        });
    }
    renderToBufferSync(option) {
        this.renderChart(option);
        const buffer = this.canvas.toBuffer();
        this.chart.dispose();
        return buffer;
    }
    renderToFile(option, filename, autoDispose = true) {
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(filename, this.renderToBufferSync(option), (error) => {
                this.chart.dispose();
                if (error)
                    return reject(error);
                return resolve();
            });
        });
    }
    renderToFileSync(option, filename, autoDispose = true) {
        fs_1.default.writeFileSync(filename, this.renderToBufferSync(option));
        if (autoDispose)
            this.chart.dispose();
    }
    dispose() {
        this.chart.dispose();
    }
}
exports.Chart = Chart;
