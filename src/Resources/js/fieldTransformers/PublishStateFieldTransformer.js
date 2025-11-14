// @flow
import React from 'react';
import {toJS} from 'mobx';
import {translate} from 'sulu-admin-bundle/utils';
import publishStateFieldTransformerStyles from './publishStateFieldTransformer.scss';
import type {Node} from 'react';

class PublishStateFieldTransformer {
    enableOffset: boolean;
    offsetWidth: number;

    constructor(enableOffset: boolean = true, offsetWidth: number = 28) {
        this.enableOffset = enableOffset;
        this.offsetWidth = offsetWidth;
    }
    transform(value: *, parameters: {[string]: any}, context: Object): Node {
        const mobxValues = context?.$mobx?.values;
        const publishedState = mobxValues?.publishedState?.value ?? value;
        const isDraft = mobxValues?.draft?.value ?? false;
        //const isDraft = Math.floor(Math.random() * 3) === 1; //testing
        const hasGhostLocale = !!mobxValues?.ghostLocale?.value;

        const styles = publishStateFieldTransformerStyles;

        let labelKey = 'sulu_tweaks.not_published';
        if (isDraft) {
            labelKey = 'sulu_tweaks.draft';
        } else if (publishedState) {
            labelKey = 'sulu_tweaks.published';
        }
        const label = translate(labelKey);

        const needsOffset = this.enableOffset && !hasGhostLocale;
        const containerClass = needsOffset
            ? `${styles.stateIndicator} ${styles.withOffset}`
            : styles.stateIndicator;
        const containerStyle = needsOffset ? {
            '--offset-width': `${this.offsetWidth}px`
        } : undefined;

        if (isDraft) {
            return (
                <span className={containerClass} style={containerStyle} title={label}>
                    <span className={`${styles.stateDot} ${styles.published}`} />
                    <span className={`${styles.stateDot} ${styles.unpublished}`} />
                </span>
            );
        }

        const colorClass = publishedState ? styles.published : styles.unpublished;
        return (
            <span className={containerClass} style={containerStyle} title={label}>
                <span className={`${styles.stateDot} ${colorClass}`} />
            </span>
        );

    }
}

export default PublishStateFieldTransformer;