<?php

namespace Manuxi\SuluTweaksBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class SuluTweaksExtension extends Extension implements PrependExtensionInterface
{
    public function load(array $configs, ContainerBuilder $container): void
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        // Store config as container parameters
        $container->setParameter(
            'sulu_tweaks.publish_state_indicator.enable_offset',
            $config['publish_state_indicator']['enable_offset']
        );
        $container->setParameter(
            'sulu_tweaks.publish_state_indicator.offset_width',
            $config['publish_state_indicator']['offset_width']
        );

        $loader = new XmlFileLoader(
            $container,
            new FileLocator(__DIR__.'/../Resources/config')
        );
        $loader->load('services.xml');
    }

    public function prepend(ContainerBuilder $container): void
    {
/*        if ($container->hasExtension('sulu_admin')) {
            $container->prependExtensionConfig('sulu_admin', [
                'lists' => [
                    'sulu_tweaks_publish_indicator_config' => [
                        'enable_offset' => '%sulu_tweaks.publish_state_indicator.enable_offset%',
                        'offset_width' => '%sulu_tweaks.publish_state_indicator.offset_width%',
                    ],
                ],
            ]);
        }*/

        if ($container->hasExtension('framework')) {
            $container->prependExtensionConfig('framework', [
                'translator' => [
                    'paths' => [
                        __DIR__.'/../Resources/translations',
                    ],
                ],
            ]);
        }
    }
}
