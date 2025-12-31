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
                            ->defaultFalse()
                        ->end()
                        ->integerNode('offset_width')
                            ->info('Width of the offset in pixels (typically 24-32px for GhostIndicator)')
                            ->defaultValue(28)
                            ->min(0)
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('star_rating')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode('show_value')
                            ->info('Show numeric value next to stars (e.g. "★★★☆☆ (3/5)")')
                            ->defaultTrue()
                        ->end()
                        ->integerNode('max_value')
                            ->info('Maximum rating value (5 or 10). Can be overridden per list via XML param.')
                            ->defaultValue(5)
                            ->min(1)
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('percent_bar')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode('show_value')
                            ->info('Show percentage value (e.g. "75%")')
                            ->defaultTrue()
                        ->end()
                        ->enumNode('value_position')
                            ->info('Position of the value: inside the bar, outside (right), or none')
                            ->values(['inside', 'outside', 'none'])
                            ->defaultValue('outside')
                        ->end()
                        ->scalarNode('value_color')
                            ->info('Color of the percentage value (hex)')
                            ->defaultValue('#000000')
                        ->end()
                        ->integerNode('max_value')
                            ->info('Maximum value for percentage calculation (e.g. 100 for 0-100, 10 for 0-10). Can be overridden per list via XML param.')
                            ->defaultValue(100)
                            ->min(1)
                        ->end()
                        ->integerNode('height')
                            ->info('Height of the bar in pixels. Under 14px, inside value is hidden. Border-radius adjusts automatically.')
                            ->defaultValue(16)
                            ->min(4)
                        ->end()
                        ->booleanNode('use_gradient')
                            ->info('Use color gradient or single color')
                            ->defaultTrue()
                        ->end()
                        ->enumNode('gradient_mode')
                            ->info('Gradient mode: interpolate (smooth) or steps (color bands)')
                            ->values(['interpolate', 'steps'])
                            ->defaultValue('interpolate')
                        ->end()
                        ->scalarNode('color')
                            ->info('Single color when use_gradient is false (hex value)')
                            ->defaultValue('#52b6ca')
                        ->end()
                        ->booleanNode('animate')
                            ->info('Animate the bar on page load')
                            ->defaultTrue()
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}