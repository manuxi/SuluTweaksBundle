// @flow
import React from 'react';
import starRatingFieldTransformerStyles from './StarRatingFieldTransformer.scss';
import type {Node} from 'react';

class StarRatingFieldTransformer {
    showValue: boolean;

    constructor(showValue: boolean = true) {
        this.showValue = showValue;
    }

    transform(value: *, parameters: {[string]: any}, context: Object): Node {
        const rating = value ? parseInt(String(value), 10) : 0;
        const styles = starRatingFieldTransformerStyles || {};

        // Detect scale: if rating > 5, assume 10-point scale
        const maxValue = rating > 5 ? 10 : 5;
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
            // 5-point scale: simple full stars
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
                {this.showValue && (
                    <span className={styles.value}>({title})</span>
                )}
            </span>
        );
    }
}

export default StarRatingFieldTransformer;