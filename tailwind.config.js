/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				// Earthfire Elegance - Complete harmonious red-brown palette
				'earthfire': {
					// Primary brick red variations
					'brick': {
						50: '#fef7f6',
						100: '#fdeee9',
						200: '#fbddd4',
						300: '#f7c2b3',
						400: '#f19e88',
						500: '#e97759',
						600: '#d55a3a',
						700: '#a94438', // Main brick red
						800: '#8a3a2f',
						900: '#723227',
						950: '#3e1a16',
					},
					// Clay warm tones
					'clay': {
						50: '#fdf9f6',
						100: '#f9f1eb',
						200: '#f4d4c3', // Main soft clay
						300: '#ebc29f',
						400: '#e0ab7a',
						500: '#d6945a',
						600: '#c7804a',
						700: '#a56b3e',
						800: '#855836',
						900: '#6b472d',
						950: '#392417',
					},
					// Warm brown spectrum
					'brown': {
						50: '#faf7f4',
						100: '#f3ede6',
						200: '#e5d7ca',
						300: '#d3bca6',
						400: '#c9a78d', // Sandstone
						500: '#b8966f',
						600: '#a68356',
						700: '#7b4b2a', // Main warm brown
						800: '#6b4125',
						900: '#5a3621',
						950: '#301c11',
					},
					// Burnt umber deep tones
					'umber': {
						50: '#faf6f5',
						100: '#f4ebe8',
						200: '#e9d7d1',
						300: '#dabab0',
						400: '#c89485',
						500: '#b87160',
						600: '#a65747',
						700: '#8a483a',
						800: '#723e33',
						900: '#5a1f18', // Burnt umber dark
						950: '#341712',
					},
				},

				// Keep your existing custom colors too
				'chiro-red': {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
					950: '#450a0a',
				},
				'chiro-brown': {
					50: '#fdf8f6',
					100: '#f2e8e5',
					200: '#eaddd7',
					300: '#e0cec7',
					400: '#d2bab0',
					500: '#bfa094',
					600: '#a18072',
					700: '#977669',
					800: '#846358',
					900: '#43302b',
					950: '#362318',
				},
				'burgundy': {
					50: '#fef7f7',
					100: '#fdeaea',
					200: '#fbd5d5',
					300: '#f7b2b2',
					400: '#f18989',
					500: '#e85d5d',
					600: '#d53f3f',
					700: '#b12929',
					800: '#9a2727',
					900: '#7c2626',
					950: '#441010',
				},

				// Existing shadcn/ui color system with HSL values
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
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
	plugins: [require("tailwindcss-animate")],
}