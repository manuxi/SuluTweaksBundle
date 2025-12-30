// @flow
import React from 'react';
import percentBarFieldTransformerStyles from './PercentBarFieldTransformer.scss';
import type {Node} from 'react';

class PercentBarFieldTransformer {
    config: Object;

    constructor(config: Object = {}) {
        this.config = {
            show_value: true,
            value_position: 'outside',
            max_value: 100,
            use_gradient: true,
            gradient_mode: 'interpolate',
            color: '#52b6ca',
            animate: true,
            ...config,
        };
    }

    getParam(parameters: ?Object, name: string, defaultValue: any): any {
        if (!parameters || !parameters[name]) {
            return defaultValue;
        }

        const param = parameters[name];
        if (typeof param === 'object' && param !== null && 'value' in param) {
            return param.value;
        }

        return param;
    }

    getInterpolatedColor(percent: number): string {
        const p = Math.max(0, Math.min(100, percent));

        // Vibrant, fully saturated colors
        const colors = [
            {p: 0,   r: 255, g: 0,   b: 0},     // Pure red
            {p: 25,  r: 255, g: 140, b: 0},     // Vibrant orange
            {p: 50,  r: 255, g: 230, b: 0},     // Bright yellow
            {p: 75,  r: 128, g: 255, b: 0},     // Lime green
            {p: 100, r: 0,   g: 200, b: 0},     // Vibrant green
        ];

        let lower = colors[0];
        let upper = colors[colors.length - 1];

        for (let i = 0; i < colors.length - 1; i++) {
            if (p >= colors[i].p && p <= colors[i + 1].p) {
                lower = colors[i];
                upper = colors[i + 1];
                break;
            }
        }

        const range = upper.p - lower.p;
        const t = range > 0 ? (p - lower.p) / range : 0;

        const r = Math.round(lower.r + (upper.r - lower.r) * t);
        const g = Math.round(lower.g + (upper.g - lower.g) * t);
        const b = Math.round(lower.b + (upper.b - lower.b) * t);

        return `rgb(${r}, ${g}, ${b})`;
    }

    getSteppedColor(percent: number): string {
        const p = Math.max(0, Math.min(100, percent));

        if (p <= 20) {
            return '#ff0000';
        } else if (p <= 40) {
            return '#ff8c00';
        } else if (p <= 60) {
            return '#ffe600';
        } else if (p <= 80) {
            return '#80ff00';
        } else {
            return '#00c800';
        }
    }

    transform(value: *, parameters: {[string]: any}, context: Object): Node {
        const styles = percentBarFieldTransformerStyles || {};

        const maxValueParam = this.getParam(parameters, 'max_value', null);
        const maxValue = maxValueParam !== null
            ? parseFloat(String(maxValueParam))
            : this.config.max_value;

        const showValueParam = this.getParam(parameters, 'show_value', null);
        const showValue = showValueParam !== null
            ? (showValueParam === true || showValueParam === 'true')
            : this.config.show_value;

        const valuePosition = this.getParam(parameters, 'value_position', this.config.value_position);

        const useGradientParam = this.getParam(parameters, 'use_gradient', null);
        const useGradient = useGradientParam !== null
            ? (useGradientParam === true || useGradientParam === 'true')
            : this.config.use_gradient;

        const gradientMode = this.getParam(parameters, 'gradient_mode', this.config.gradient_mode);

        const singleColor = this.getParam(parameters, 'color', this.config.color);

        const animateParam = this.getParam(parameters, 'animate', null);
        const animate = animateParam !== null
            ? (animateParam === true || animateParam === 'true')
            : this.config.animate;

        const rawValue = value ? parseFloat(String(value)) : 0;
        const percent = Math.max(0, Math.min(100, (rawValue / maxValue) * 100));
        const displayValue = Math.round(percent);

        let barColor = singleColor;
        if (useGradient) {
            barColor = gradientMode === 'steps'
                ? this.getSteppedColor(percent)
                : this.getInterpolatedColor(percent);
        }

        const title = `${rawValue}/${maxValue} (${displayValue}%)`;

        const containerClasses = [styles.container];
        if (animate) {
            containerClasses.push(styles.animated);
        }

        const showValueInside = showValue && valuePosition === 'inside';
        const showValueOutside = showValue && valuePosition === 'outside';

        return (
            <span className={containerClasses.join(' ')} title={title}>
                <span className={styles.barBackground}>
                    <span
                        className={styles.barFill}
                        style={{
                            width: `${percent}%`,
                            backgroundColor: barColor,
                        }}
                    />
                    {showValueInside && (
                        <span className={styles.valueInside}>
                            {displayValue}%
                        </span>
                    )}
                </span>
                {showValueOutside && (
                    <span className={styles.valueOutside}>{displayValue}%</span>
                )}
            </span>
        );
    }
}

export default PercentBarFieldTransformer;