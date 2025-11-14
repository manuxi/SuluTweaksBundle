// @flow
import {initializer} from 'sulu-admin-bundle/services';
import listFieldTransformerRegistry from 'sulu-admin-bundle/containers/List/registries/listFieldTransformerRegistry';
import PublishStateFieldTransformer from './FieldTransformers/PublishStateFieldTransformer';

initializer.addUpdateConfigHook('sulu_tweaks', (config: Object, initialized: boolean) => {
    if (initialized) {
        return;
    }

    const publishStateConfig = config.publish_state_indicator || {};

    const transformer = new PublishStateFieldTransformer(
        publishStateConfig.enable_offset === true,
        publishStateConfig.offset_width || 28
    );

    listFieldTransformerRegistry.add('publish_state_indicator', transformer);
});

export {PublishStateFieldTransformer};