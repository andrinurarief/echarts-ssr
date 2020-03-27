/// <reference types="node" />
import { EChartOption, EChartsResponsiveOption } from 'echarts';
import { Readable } from 'stream';
export declare class Chart {
    private width;
    private height;
    private canvas;
    private chart;
    constructor(width: number, height: number);
    getChartSize(): {
        width: number;
        height: number;
    };
    renderChart(option: EChartOption | EChartsResponsiveOption): void;
    renderToStream(option: EChartOption | EChartsResponsiveOption, type?: 'png' | 'jpg' | 'pdf'): Readable;
    renderToBuffer(option: EChartOption | EChartsResponsiveOption): Promise<Buffer>;
    renderToBufferSync(option: EChartOption | EChartsResponsiveOption): Buffer;
    renderToFile(option: EChartOption | EChartsResponsiveOption, filename: string, autoDispose?: boolean): Promise<void>;
    renderToFileSync(option: EChartOption | EChartsResponsiveOption, filename: string, autoDispose?: boolean): void;
    dispose(): void;
}
