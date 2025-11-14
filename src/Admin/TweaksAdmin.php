<?php

declare(strict_types=1);

namespace Manuxi\SuluTweaksBundle\Admin;

use Sulu\Bundle\AdminBundle\Admin\Admin;
use Sulu\Bundle\AdminBundle\Admin\View\ViewBuilderFactoryInterface;

class TweaksAdmin extends Admin
{
    public const SULU_TWEAKS_CONFIG_KEY = 'sulu_tweaks';

    private bool $enableOffset;
    private int $offsetWidth;

    public function __construct(
        ViewBuilderFactoryInterface $viewBuilderFactory,
        bool $enableOffset,
        int $offsetWidth,
    ) {
        $this->viewBuilderFactory = $viewBuilderFactory;
        $this->enableOffset = $enableOffset;
        $this->offsetWidth = $offsetWidth;
    }

    public function getConfigKey(): ?string
    {
        return self::SULU_TWEAKS_CONFIG_KEY;
    }

    public function getConfig(): ?array
    {
        return [
            'publish_state_indicator' => [
                'enable_offset' => $this->enableOffset,
                'offset_width' => $this->offsetWidth,
            ],
        ];
    }
}
