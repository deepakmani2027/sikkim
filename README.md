# Sikkim monasteries app

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nagmaniprasad076-7981s-projects/v0-sikkim-monasteries-app-3x)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/JPLiLzS66r5)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/nagmaniprasad076-7981s-projects/v0-sikkim-monasteries-app-3x](https://vercel.com/nagmaniprasad076-7981s-projects/v0-sikkim-monasteries-app-3x)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/JPLiLzS66r5](https://v0.app/chat/projects/JPLiLzS66r5)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository# sikkim

<<<<<<< Updated upstream
## Maps & Directions Configuration

This project now uses the Google Maps JavaScript API and Directions API for:
- Interactive maps on monastery directions page (`/monastery/[id]/directions`)
- Transport panel map in `/service`
- Driving & walking route polylines and time/distance estimates

### Environment Variables

Add the following to your environment (e.g. `.env.local` for local dev and Vercel project settings for production):

```
GOOGLE_MAPS_API_KEY=YOUR_SERVER_KEY_WITH_DIRECTIONS
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_BROWSER_KEY (can be same key if restricted properly)
```

Recommended restrictions:
- Browser key: HTTP referrer restrictions for your domain(s); enable Maps JavaScript API.
- Server key: IP restriction (Vercel build / serverless IP ranges if desired); enable Directions API.

### Internal Proxy

`/api/directions` proxies requests to Google Directions so the browser does not expose the server key. Parameters:
`/api/directions?origin=lat,lng&destination=lat,lng&modes=driving,walking,transit`

Returns:
```
{
	routes: [
		{ mode, distanceMeters, durationSeconds, polyline: { path: [{lat,lng}] } }, ...
	]
}
```

If the API keys are missing the UI will fall back to simple haversine estimates.

no changes
sikkim
=======
## Google Scholar search (SerpAPI proxy)

To enable researcher Google Scholar search via SerpAPI:

1. Add a `.env.local` file with:

```
SERPAPI_KEY=your_serpapi_key_here
```

2. Use the Researcher Dashboard to query. The server route `GET /api/scholar` proxies to SerpAPI `engine=google_scholar` and supports:
   - q (query), cites, as_ylo, as_yhi, scisbd, cluster

3. The UI provides year filters, recent-only toggle (scisbd), cited-by and PDF quick links.
>>>>>>> Stashed changes
