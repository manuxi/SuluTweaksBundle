// @flow
import React from 'react';
import starRatingFieldTransformerStyles from './StarRatingFieldTransformer.scss';
import type {Node} from 'react';

class StarRatingFieldTransformer {
    config: Object;

    constructor(config: Object = {}) {
        this.config = {
            show_value: true,
            max_value: 5,
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

    transform(value: *, parameters: {[string]: any}, context: Object): Node {
        const rating = value ? parseInt(String(value), 10) : 0;
        const styles = starRatingFieldTransformerStyles || {};

        // Get parameters with fallback to config
        const maxValueParam = this.getParam(parameters, 'max_value', null);
        const maxValue = maxValueParam !== null
            ? parseInt(String(maxValueParam), 10)
            : this.config.max_value;

        const showValueParam = this.getParam(parameters, 'show_value', null);
        const showValue = showValueParam !== null
            ? (showValueParam === true || showValueParam === 'true')
            : this.config.show_value;

        const displayStars = 5;
        const stars = [];
        const title = `${rating}/${maxValue}`;

        if (maxValue === 10) {
            // 10-point scale: use half-star increments
            for (let i = 1; i <= displayStars; i++) {
                const starValue = i * 2;
                const halfStarValue = starValue - 1;
                let starClass = styles.empty;
                let starChar = '☆';

                if (rating >= starValue) {
                    starClass = styles.filled;
                    starChar = '★';
                } else if (rating >= halfStarValue) {
                    starClass = styles.half;
                    starChar = '⯪';
                }

                stars.push(
                    <span key={i} className={starClass}>
                        {starChar}
                    </span>
                );
            }
        } else {
            // 5-point scale (or other): simple full stars
            for (let i = 1; i <= displayStars; i++) {
                const isFilled = i <= rating;
                stars.push(
                    <span
                        key={i}
                        className={isFilled ? styles.filled : styles.empty}
                    >
                        {isFilled ? '★' : '☆'}
                    </span>
                );
            }
        }

        return (
            <span className={styles.container} title={title}>
                {stars}
                {showValue && (
                    <span className={styles.value}>({title})</span>
                )}
            </span>
        );
    }
}

export default StarRatingFieldTransformer;