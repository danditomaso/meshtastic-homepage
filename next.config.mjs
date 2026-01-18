/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/docs/settings/',
        destination: '/docs/configuration/',
        permanent: true,
      },
      {
        source: '/docs/settings/config/',
        destination: '/docs/configuration/radio/',
        permanent: true,
      },
      {
        source: '/docs/settings/config/:path*/',
        destination: '/docs/configuration/radio/:path*/',
        permanent: true,
      },
      {
        source: '/docs/settings/moduleconfig/',
        destination: '/docs/configuration/module/',
        permanent: true,
      },
      {
        source: '/docs/settings/moduleconfig/:path*/',
        destination: '/docs/configuration/module/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/peripheral/',
        destination: '/docs/configuration/module/remote-hardware/#remote-hardware-module-usage',
        permanent: true,
      },
      {
        source: '/docs/configuration/rak-gpio-mapping/',
        destination: '/docs/hardware/devices/rak/core-module/#gpio',
        permanent: true,
      },
      {
        source: '/software/android-too-old/:path*/',
        destination: '/docs/software/android/installation/',
        permanent: true,
      },
      {
        source: '/docs/software/android/android-installation/:path*/',
        destination: '/docs/software/android/installation/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/Nano%20Series/',
        destination: '/docs/hardware/devices/nano/',
        permanent: true,
      },
      {
        source: '/docs/hardware/supported-hardware/',
        destination: '/docs/hardware/devices/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/station-g1/',
        destination: '/docs/hardware/devices/station-series/',
        permanent: true,
      },
      {
        source: '/docs/legal/trademark/',
        destination: '/docs/legal/licensing-and-trademark/',
        permanent: true,
      },
      {
        source: '/docs/legal/licensing/',
        destination: '/docs/legal/licensing-and-trademark/',
        permanent: true,
      },
      {
        source: '/docs/software/mqtt/',
        destination: '/docs/software/integrations/mqtt/',
        permanent: true,
      },
      {
        source: '/docs/software/mqtt/:path*/',
        destination: '/docs/software/integrations/mqtt/:path*/',
        permanent: true,
      },
      {
        source: '/docs/getting-started/faq/',
        destination: '/docs/faq/',
        permanent: true,
      },
      {
        source: '/docs/',
        destination: '/docs/introduction/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/rak/:path*/',
        destination: '/docs/hardware/devices/rak-wireless/wisblock/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/lora/:path*/',
        destination: '/docs/hardware/devices/lilygo/lora/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/tbeam/:path*/',
        destination: '/docs/hardware/devices/lilygo/tbeam/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/techo/:path*/',
        destination: '/docs/hardware/devices/lily/techo/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/tdeck/:path*/',
        destination: '/docs/hardware/devices/lilygo/tdeck/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/twatch/:path*/',
        destination: '/docs/hardware/devices/lilygo/twatch/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/heltec/:path*/',
        destination: '/docs/hardware/devices/heltec-automation/lora32/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/heltec-sensor/:path*/',
        destination: '/docs/hardware/devices/heltec-automation/sensor/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/nano/:path*/',
        destination: '/docs/hardware/devices/b-and-q-consulting/nano/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/station-series/:path*/',
        destination: '/docs/hardware/devices/b-and-q-consulting/station-series/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/raspberry-pi/:path*/',
        destination: '/docs/hardware/devices/raspberrypi/pico/:path*/',
        permanent: true,
      },
      {
        source: '/docs/community/software/community-meshtasticator/',
        destination: '/docs/software/meshtasticator/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/seeed-studio/esp32-sx1262-kit/',
        destination: '/docs/hardware/devices/seeed-studio/wio-sx1262/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/seeed-studio/wm1110/:path*/',
        destination: '/docs/hardware/devices/seeed-studio/wio-series/seeed-wm1110/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/seeed-studio/wio-e5/:path*/',
        destination: '/docs/hardware/devices/seeed-studio/wio-series/seeed-wio-e5/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/seeed-studio/wio-sx1262/:path*/',
        destination: '/docs/hardware/devices/seeed-studio/wio-series/wio-sx1262s/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/unPhone/',
        destination: '/docs/hardware/devices/community-supported/unPhone/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/canary/',
        destination: '/docs/hardware/devices/community-supported/canary/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/chatter/:path*/',
        destination: '/docs/hardware/devices/community-supported/chatter/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/lilygo/tlorac6/:path*/',
        destination: '/docs/hardware/devices/community-supported/lilygo/tlorac6/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/lilygo/twatch/:path*/',
        destination: '/docs/hardware/devices/community-supported/lilygo/twatch/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/seeed-studio/wio-series/seeed-wio-e5/:path*/',
        destination: '/docs/hardware/devices/community-supported/seeed-studio/wio-series/seeed-wio-e5/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/seeed-studio/wio-series/seeed-wm1110/:path*/',
        destination: '/docs/hardware/devices/community-supported/seeed-studio/wio-series/seeed-wm1110/:path*/',
        permanent: true,
      },
      {
        source: '/docs/hardware/devices/heltec-automation/sensor/:path*/',
        destination: '/docs/hardware/devices/community-supported/heltec-automation/sensor/:path*/',
        permanent: true,
      },
      {
        source: '/docs/software/meshtastic-ui/:path*/',
        destination: '/docs/configuration/device-uis/meshtasticui/:path*/',
        permanent: true,
      },
      {
        source: '/docs/software/inkhud/:path*/',
        destination: '/docs/configuration/device-uis/inkhud/:path*/',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/docs/:path*/',
          destination: 'http://localhost:3001/docs/:path*/',
        },
      ]
    }
  }
}

export default nextConfig
