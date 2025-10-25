import type { Config } from "tailwindcss";

export default {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        serif: ['var(--font-eb-garamond)', 'EB Garamond', 'serif'],
      },
      colors: {
        blue: {
          25: '#f0f7ff',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "hsl(var(--accent-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-web3': 'var(--gradient-web3)',
        'gradient-bg': 'var(--gradient-bg)',
        'gradient-card': 'var(--gradient-card)',
      },
      boxShadow: {
        'cyber': 'var(--shadow-cyber)',
        'neon': 'var(--shadow-neon)',
        'card': 'var(--shadow-card)',
        'glow': 'var(--shadow-glow)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100px)",
          },
          "100%": {
            transform: "translateX(400px)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translate(0px, 0px) rotate(0deg)",
          },
          "25%": {
            transform: "translate(5px, -10px) rotate(2deg)",
          },
          "50%": {
            transform: "translate(-5px, -15px) rotate(-2deg)",
          },
          "75%": {
            transform: "translate(7px, -10px) rotate(1deg)",
          },
        },
        "float-delayed": {
          "0%, 100%": {
            transform: "translate(0px, 0px) rotate(0deg)",
          },
          "33%": {
            transform: "translate(-7px, -12px) rotate(-3deg)",
          },
          "66%": {
            transform: "translate(8px, -18px) rotate(3deg)",
          },
        },
        "float-slow": {
          "0%, 100%": {
            transform: "translate(0px, 0px) rotate(0deg)",
          },
          "50%": {
            transform: "translate(-20px, -35px) rotate(-10deg)",
          },
        },
        "float-diagonal": {
          "0%, 100%": {
            transform: "translate(0px, 0px) rotate(0deg)",
          },
          "25%": {
            transform: "translate(25px, -20px) rotate(8deg)",
          },
          "50%": {
            transform: "translate(10px, -45px) rotate(-8deg)",
          },
          "75%": {
            transform: "translate(-15px, -25px) rotate(5deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s ease-in-out",
        float: "float 8s ease-in-out infinite",
        "float-delayed": "float-delayed 10s ease-in-out infinite",
        "float-slow": "float-slow 12s ease-in-out infinite",
        "float-diagonal": "float-diagonal 9s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
