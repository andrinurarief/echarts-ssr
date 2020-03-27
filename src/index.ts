import fs from 'fs';
import echarts, { ECharts, EChartOption, EChartsResponsiveOption } from 'echarts';
import { Canvas, createCanvas } from 'canvas';
import { Readable } from 'stream';
import { JSDOM } from 'jsdom';

export class Chart {

    private width : number = 800;
    private height : number = 600;
    private canvas : Canvas = null;
    private chart : ECharts = null;


    constructor(width : number, height : number) {

        const { window } = new JSDOM();
        global['window'] = window;
        global['navigator'] = window.navigator;
        global['document'] = window.document;

        this.width = width;
        this.height = height;

        this.canvas = createCanvas(width, height);
        this.canvas.width = width;
        this.canvas.height = height;

        this.chart = echarts.init(this.canvas as unknown as HTMLCanvasElement);
    }


    getChartSize() {
        return { width: this.width, height: this.height }
    }

    renderChart(option: EChartOption | EChartsResponsiveOption) {
        this.chart.setOption(option);
    }

    renderToStream(option: EChartOption | EChartsResponsiveOption, type : 'png' | 'jpg' | 'pdf' = 'png', autoDispose : boolean = true) : Readable {
        this.chart.setOption(option);
        if(autoDispose) this.chart.dispose();
        switch(type) {
            case 'png': return this.canvas.createPNGStream();
            case 'jpg': return this.canvas.createJPEGStream();
            case 'pdf': return this.canvas.createPDFStream();
        }
    }

    renderToBuffer(option: EChartOption | EChartsResponsiveOption, autoDispose : boolean = true) : Promise<Buffer> {    
        this.renderChart(option);
        
        return new Promise<Buffer>((resolve, reject) => {
            this.canvas.toBuffer((error : Error | null, buffer: Buffer) => {  
                if(autoDispose) this.chart.dispose();          
                if(error) return reject(error);
                return resolve(buffer);                
            });
        });
    }

    renderToBufferSync(option: EChartOption | EChartsResponsiveOption, autoDispose : boolean = true) : Buffer {
        this.renderChart(option);
        const buffer = this.canvas.toBuffer();
        if(autoDispose) this.chart.dispose();
        return buffer;
    }

    renderToFile(option: EChartOption | EChartsResponsiveOption, filename : string, autoDispose : boolean = true) : Promise<void> {
        return new Promise<any>((resolve, reject) => {            
            fs.writeFile(filename, this.renderToBufferSync(option), (error : Error | null) => {
                if(autoDispose) this.chart.dispose();
                if(error) return reject(error);
                return resolve();
            })
        });
    }

    renderToFileSync(option: EChartOption | EChartsResponsiveOption, filename : string, autoDispose : boolean = true) {        
        fs.writeFileSync(filename, this.renderToBufferSync(option));
        if(autoDispose) this.chart.dispose();
    }

    dispose() {
        this.chart.dispose();
    }

}