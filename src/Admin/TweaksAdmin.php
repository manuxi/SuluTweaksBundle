<?php

declare(strict_types=1);

namespace Manuxi\SuluTweaksBundle\Admin;

use Sulu\Bundle\AdminBundle\Admin\Admin;
use Sulu\Bundle\AdminBundle\Admin\View\ViewBuilderFactoryInterface;

class TweaksAdmin extends Admin
{
    public const SULU_TWEAKS_CONFIG_KEY = 'sulu_tweaks';

    private array $config;

    public function __construct(
        private ViewBuilderFactoryInterface $viewBuilderFactory,
        array $config,
    ) {
        $this->config = $config;
    }

    public function getConfigKey(): ?string
    {
        return self::SULU_TWEAKS_CONFIG_KEY;
    }

    public function getConfig(): ?array
    {
        return $this->config;
    }
}