# AdSense Setup Guide - Quick Reference

## Current Status
✅ AdSense script installed with publisher ID: `ca-pub-6323375086153079`
✅ Auto ads working
❌ Manual ad placements showing empty (need real slot IDs)

## What You Need to Do

### Step 1: Create Ad Units in AdSense Dashboard

Go to [Google AdSense](https://www.google.com/adsense/) and create these ad units:

#### Display Ad Units (Create as "Display ads")
1. **Homepage Top Banner**
   - Type: Display ads
   - Size: Responsive
   - Copy the slot ID → Update `homepageTop` in config.ts

2. **Homepage Footer Banner**
   - Type: Display ads
   - Size: Responsive (Horizontal preferred)
   - Copy the slot ID → Update `homepageFooter` in config.ts

3. **App Sidebar Ad**
   - Type: Display ads
   - Size: Responsive (Vertical preferred)
   - Copy the slot ID → Update `appSidebar` in config.ts

4. **App Mobile Sticky Ad**
   - Type: Display ads
   - Size: Responsive (Horizontal preferred)
   - Copy the slot ID → Update `appMobileSticky` in config.ts

5. **Messages Page Ad**
   - Type: Display ads
   - Size: Responsive (Vertical preferred)
   - Copy the slot ID → Update `messagesTop` in config.ts

#### In-Article Ad Units (Create as "In-article ads")
6. **Blog Top Ad**
   - Type: In-article ads
   - Copy the slot ID → Update `blogTop` in config.ts

7. **Blog Middle Ad**
   - Type: In-article ads
   - Copy the slot ID → Update `blogMiddle` in config.ts

8. **Blog Bottom Ad**
   - Type: In-article ads
   - Copy the slot ID → Update `blogBottom` in config.ts

### Step 2: Update src/config.ts

Replace the placeholder slot IDs in `ANALYTICS_CONFIG.adsense.slots`:

```typescript
slots: {
    // Homepage ad placements
    homepageTop: '1234567890',      // ← Replace with real slot ID from AdSense
    homepageFooter: '0987654321',   // ← Replace with real slot ID from AdSense
    
    // Blog post ad placements (create as In-article ad units)
    blogTop: 'XXXXXXXXXX',          // ← Replace with real slot ID from AdSense
    blogMiddle: 'XXXXXXXXXX',       // ← Replace with real slot ID from AdSense
    blogBottom: 'XXXXXXXXXX',       // ← Replace with real slot ID from AdSense
    
    // App page ad placements
    appSidebar: 'XXXXXXXXXX',       // ← Replace with real slot ID from AdSense
    appMobileSticky: 'XXXXXXXXXX',  // ← Replace with real slot ID from AdSense
    
    // Messages page ad placement
    messagesTop: 'XXXXXXXXXX',      // ← Replace with real slot ID from AdSense
},
```

### Step 3: How to Get Slot IDs from AdSense

1. Sign in to your AdSense account
2. Click **Ads** in the left menu
3. Click **By ad unit**
4. Find your ad unit in the list
5. Click **Get code** (< > icon)
6. Look for `data-ad-slot="XXXXXXXXXX"` in the code
7. Copy the 10-digit number
8. Paste it into config.ts

### Step 4: Wait and Verify

- Ads may take **5-60 minutes** to start showing after creating ad units
- Check your site status is "Ready" in AdSense → Sites
- Open browser DevTools → Network tab → Filter by "adsbygoogle" to verify requests

## Where Ads Are Placed

| Page | Location | Slot Config Key |
|------|----------|----------------|
| Homepage (/) | Below hero section | `homepageTop` |
| Homepage (/) | Footer area | `homepageFooter` |
| Blog posts (/blog/*) | Top of content | `blogTop` |
| Blog posts (/blog/*) | Middle of content | `blogMiddle` |
| Blog posts (/blog/*) | Bottom of content | `blogBottom` |
| App page (/app) | Sidebar (desktop) | `appSidebar` |
| App page (/app) | Sticky bottom (mobile) | `appMobileSticky` |
| Messages (/app/messages) | Sidebar/sticky | `messagesTop` |

## Troubleshooting

**Ads still not showing after updating slot IDs?**
- Wait 1 hour (Google needs time to process new ad units)
- Check AdSense dashboard for approval status
- Verify site status is "Ready" in AdSense
- Check browser console for errors
- Make sure you're not using an ad blocker

**How to test if ads are loading?**
```bash
# Open browser DevTools → Console and run:
window.adsbygoogle
# Should return an array, not undefined
```

## Files Modified

- ✅ `src/config.ts` - Added centralized slot ID configuration
- ✅ `src/pages/index.astro` - Updated to use config slots
- ✅ `src/pages/blog/[...slug].astro` - Updated to use config slots
- ✅ `src/pages/app/index.astro` - Updated to use config slots
- ✅ `src/pages/app/messages.astro` - Updated to use config slots

## Next Steps

1. Create the 8 ad units in AdSense dashboard
2. Copy each slot ID
3. Update `src/config.ts` with real slot IDs
4. Deploy your changes
5. Wait 1 hour and check if ads appear
