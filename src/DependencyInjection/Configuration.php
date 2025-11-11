<?php

declare(strict_types=1);

namespace Manuxi\SuluTweaksBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('sulu_tweaks');

        $treeBuilder->getRootNode()
            ->children()
                ->arrayNode('publish_state_indicator')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode('enable_offset')
                            ->info('Enable left offset to align with GhostIndicator (for multilingual projects)')
                            ->defaultTrue()
                        ->end()
                        ->integerNode('offset_width')
                            ->info('Width of the offset in pixels (typically 24-32px for GhostIndicator)')
                            ->defaultValue(28)
                            ->min(0)
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}