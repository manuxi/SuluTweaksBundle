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

        const title = `${rawValue}/${maxValue} (${displayValue}%)`;

        const containerClasses = [styles.container];
        if (animate) {
            containerClasses.push(styles.animated);
        }

        const showValueInside = showValue && valuePosition === 'inside';
        const showValueOutside = showValue && valuePosition === 'outside';

        const barFillClasses = [styles.barFill];
        const barFillStyle: Object = {
            width: `${percent}%`,
        };

        if (!useGradient) {
            barFillStyle.backgroundColor = singleColor;
        } else if (gradientMode === 'steps') {
            barFillStyle.backgroundColor = this.getSteppedColor(percent);
        } else {
            barFillClasses.push(styles.gradientSmooth);
            if (percent > 0) {
                barFillStyle.backgroundSize = `${(100 / percent) * 100}% 100%`;
            }
        }

        return (
            <span className={containerClasses.join(' ')} title={title}>
                <span className={styles.barBackground}>
                    <span
                        className={barFillClasses.join(' ')}
                        style={barFillStyle}
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