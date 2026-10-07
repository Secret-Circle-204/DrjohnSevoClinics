import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))',
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))',
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  			},
  			ring: 'hsl(var(--ring))',
  			input: 'hsl(var(--input))',
  			'primary-brown': 'var(--color-primary-brown)',
  			'deep-brown': 'var(--color-deep-brown)',
  			'primary-gold': 'var(--color-primary-gold)',
  			'light-gold': 'var(--color-light-gold)',
  			'light-neutral': 'var(--color-light-neutral)',
  			'soft-neutral': 'var(--color-soft-neutral)',
  			'warm-tint': 'var(--color-warm-tint)',
  			border: 'var(--color-border)',
  		},
  		fontFamily: {
  			americana: [
  				'Americana',
  				'Georgia',
  				'serif'
  			],
  			perpetua: [
  				'Perpetua',
  				'Georgia',
  				'serif'
  			],
  			dinar: [
  				'GE Dinar Two',
  				'GE-Dinar-Two-Medium',
  				'GE Dinar Two Medium',
  				'Montserrat',
  				'sans-serif'
  			],
  			castelar: [
  				'Castelar',
  				'serif'
  			],
  			arabic: [
  				'GE Dinar Two',
  				'GE-Dinar-Two-Medium',
  				'GE Dinar Two Medium',
  				'Tahoma',
  				'sans-serif'
  			],
  			sans: [
  				'GE Dinar Two',
  				'GE-Dinar-Two-Medium',
  				'GE Dinar Two Medium',
  				'Montserrat',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			sm: 'var(--radius-sm)',
  			md: 'var(--radius-md)',
  			lg: 'var(--radius-lg)',
  			xl: 'var(--radius-xl)',
  			pill: 'var(--radius-pill)'
  		},
  		boxShadow: {
  			subtle: 'var(--shadow-subtle)',
  			card: 'var(--shadow-card)',
  			deep: 'var(--shadow-deep)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
}

export default config
