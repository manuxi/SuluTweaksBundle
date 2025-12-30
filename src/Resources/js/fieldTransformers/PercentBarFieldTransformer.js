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
            color: '#52b6ca',
            animate: true,
            ...config,
        };
    }

    getParam(parameters: ?Object, name: string, defaultValue: any): any {
        if (!parameters || !parameters[name]) {
            return defaultValue;
        }

        // Sulu can pass params as {name: {value: x}} or {name: x}
        const param = parameters[name];
        if (typeof param === 'object' && param !== null && 'value' in param) {
            return param.value;
        }

        return param;
    }

    getColorClass(percent: number, styles: Object): string {
        const p = Math.max(0, Math.min(100, percent));

        if (p <= 20) {
            return styles.color0;
        } else if (p <= 40) {
            return styles.color25;
        } else if (p <= 60) {
            return styles.color50;
        } else if (p <= 80) {
            return styles.color75;
        } else {
            return styles.color100;
        }
    }

    transform(value: *, parameters: {[string]: any}, context: Object): Node {
        const styles = percentBarFieldTransformerStyles || {};

        // Get parameters with fallback to config
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

        const singleColor = this.getParam(parameters, 'color', this.config.color);

        const animateParam = this.getParam(parameters, 'animate', null);
        const animate = animateParam !== null
            ? (animateParam === true || animateParam === 'true')
            : this.config.animate;

        // Calculate percentage
        const rawValue = value ? parseFloat(String(value)) : 0;
        const percent = Math.max(0, Math.min(100, (rawValue / maxValue) * 100));
        const displayValue = Math.round(percent);

        // Determine color class (only used when useGradient is true)
        const colorClass = useGradient ? this.getColorClass(percent, styles) : '';

        // Title always shows the value
        const title = `${rawValue}/${maxValue} (${displayValue}%)`;

        // Build class names
        const containerClasses = [styles.container];
        if (animate) {
            containerClasses.push(styles.animated);
        }

        // Build bar fill classes
        const barFillClasses = [styles.barFill];
        if (useGradient && colorClass) {
            barFillClasses.push(colorClass);
        }

        // Determine if value should be shown and where
        const showValueInside = showValue && valuePosition === 'inside';
        const showValueOutside = showValue && valuePosition === 'outside';

        // For inside positioning, determine text color based on percentage
        // Dark text for yellow (40-60%), white for others
        const insideTextColor = (percent > 40 && percent <= 60) ? '#333' : '#fff';

        // Bar fill style (only backgroundColor when not using gradient)
        const barFillStyle: Object = {width: `${percent}%`};
        if (!useGradient) {
            barFillStyle.backgroundColor = singleColor;
        }

        return (
            <span className={containerClasses.join(' ')} title={title}>
                <span className={styles.barBackground}>
                    <span
                        className={barFillClasses.join(' ')}
                        style={barFillStyle}
                    >
                        {showValueInside && (
                            <span
                                className={styles.valueInside}
                                style={{color: insideTextColor}}
                            >
                                {displayValue}%
                            </span>
                        )}
                    </span>
                </span>
                {showValueOutside && (
                    <span className={styles.valueOutside}>{displayValue}%</span>
                )}
            </span>
        );
    }
}

export default PercentBarFieldTransformer;