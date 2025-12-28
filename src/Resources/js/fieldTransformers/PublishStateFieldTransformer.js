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
        console.log('12. mobxValues:', mobxValues);

        if (mobxValues) {
            console.log('13. mobxValues keys:', Object.keys(mobxValues));
            for (const key of Object.keys(mobxValues)) {
                console.log(`    ${key}:`, mobxValues[key]?.value);
            }
        }

        // Try to get values from context directly (not via $mobx)
        const directPublishedState = context?.publishedState;
        const directLivePublished = context?.livePublished;
        const directWorkflowPlace = context?.workflowPlace;

        const styles = publishStateFieldTransformerStyles;

        // Determine draft status from multiple sources
        // Draft = has been published (livePublished exists) but current state is not published
        const publishedState = mobxValues?.publishedState?.value ?? directPublishedState ?? value;
        const livePublished = mobxValues?.livePublished?.value ?? directLivePublished;
        const workflowPlace = mobxValues?.workflowPlace?.value ?? directWorkflowPlace;
        const hasGhostLocale = !!(mobxValues?.ghostLocale?.value ?? context?.ghostLocale);

        // isDraft: published before (livePublished exists) but publishedState is false/draft
        const isDraft = (livePublished && (publishedState === false || publishedState === 'draft' || workflowPlace === 'draft'));

        let labelKey = 'sulu_tweaks.not_published';
        if (isDraft) {
            labelKey = 'sulu_tweaks.draft';
        } else if (publishedState === true || publishedState === 'published' || workflowPlace === 'published') {
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

        const isPublished = publishedState === true || publishedState === 'published' || workflowPlace === 'published';
        const colorClass = isPublished ? styles.published : styles.unpublished;

        return (
            <span className={containerClass} style={containerStyle} title={label}>
                <span className={`${styles.stateDot} ${colorClass}`} />
            </span>
        );
    }
}

export default PublishStateFieldTransformer;