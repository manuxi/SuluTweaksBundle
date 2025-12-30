// @flow
import {initializer} from 'sulu-admin-bundle/services';
import listFieldTransformerRegistry from 'sulu-admin-bundle/containers/List/registries/listFieldTransformerRegistry';
import PublishStateFieldTransformer from './FieldTransformers/PublishStateFieldTransformer';
import GhostLocaleFieldTransformer from './FieldTransformers/GhostLocaleFieldTransformer';
import StarRatingFieldTransformer from './FieldTransformers/StarRatingFieldTransformer';
import PercentBarFieldTransformer from './fieldTransformers/PercentBarFieldTransformer';

initializer.addUpdateConfigHook('sulu_tweaks', (config: Object, initialized: boolean) => {
    if (initialized) {
        return;
    }

    const publishStateConfig = config.publish_state_indicator || {};
    const starRatingConfig = config.star_rating || {};
    const percentBarConfig = config.percent_bar || {};

    listFieldTransformerRegistry.add(
        'publish_state_indicator',
        new PublishStateFieldTransformer(publishStateConfig)
    );

    listFieldTransformerRegistry.add(
        'ghost_locale_indicator',
        new GhostLocaleFieldTransformer()
    );

    listFieldTransformerRegistry.add(
        'star_rating',
        new StarRatingFieldTransformer(starRatingConfig)
    );

    listFieldTransformerRegistry.add(
        'percent_bar',
        new PercentBarFieldTransformer(percentBarConfig)
    );
});

export {
    PublishStateFieldTransformer,
    GhostLocaleFieldTransformer,
    StarRatingFieldTransformer,
    PercentBarFieldTransformer,
};