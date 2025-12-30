// @flow
import {initializer} from 'sulu-admin-bundle/services';
import listFieldTransformerRegistry from 'sulu-admin-bundle/containers/List/registries/listFieldTransformerRegistry';
import PublishStateFieldTransformer from './FieldTransformers/PublishStateFieldTransformer';
import GhostLocaleFieldTransformer from './FieldTransformers/GhostLocaleFieldTransformer';
import StarRatingFieldTransformer from './FieldTransformers/StarRatingFieldTransformer';

initializer.addUpdateConfigHook('sulu_tweaks', (config: Object, initialized: boolean) => {
    if (initialized) {
        return;
    }

    const publishStateConfig = config.publish_state_indicator || {};
    const starRatingConfig = config.star_rating || {};

    const publishStateTransformer = new PublishStateFieldTransformer(
        publishStateConfig.enable_offset === true,
        publishStateConfig.offset_width || 28
    );

    const starRatingTransformer = new StarRatingFieldTransformer(
        starRatingConfig.show_value !== false
    );

    listFieldTransformerRegistry.add('publish_state_indicator', publishStateTransformer);
    listFieldTransformerRegistry.add('ghost_locale_indicator', new GhostLocaleFieldTransformer());
    listFieldTransformerRegistry.add('star_rating', starRatingTransformer);
});

export {PublishStateFieldTransformer, GhostLocaleFieldTransformer, StarRatingFieldTransformer};