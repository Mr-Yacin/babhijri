import { describe, it, expect } from 'vitest';
import { isAnalyticsEnabledPage } from '../analytics';
import { isAdEnabledPage } from '../ads';

describe('Route-based filtering', () => {
    describe('Analytics routing', () => {
        describe('Analytics should load on allowed pages', () => {
            it('should enable analytics on homepage', () => {
                expect(isAnalyticsEnabledPage('/')).toBe(true);
            });

            it('should enable analytics on blog index', () => {
                expect(isAnalyticsEnabledPage('/blog')).toBe(true);
                expect(isAnalyticsEnabledPage('/blog/')).toBe(true);
            });

            it('should enable analytics on blog posts', () => {
                expect(isAnalyticsEnabledPage('/blog/my-post')).toBe(true);
                expect(isAnalyticsEnabledPage('/blog/another-post/')).toBe(true);
            });

            it('should enable analytics on app index', () => {
                expect(isAnalyticsEnabledPage('/app')).toBe(true);
                expect(isAnalyticsEnabledPage('/app/')).toBe(true);
            });

            it('should enable analytics on messages page', () => {
                expect(isAnalyticsEnabledPage('/app/messages')).toBe(true);
                expect(isAnalyticsEnabledPage('/app/messages/')).toBe(true);
            });
        });

        describe('Analytics should NOT load on excluded pages', () => {
            it('should disable analytics on admin pages', () => {
                expect(isAnalyticsEnabledPage('/app/admin')).toBe(false);
                expect(isAnalyticsEnabledPage('/app/admin/')).toBe(false);
                expect(isAnalyticsEnabledPage('/app/admin/users')).toBe(false);
            });

            it('should disable analytics on profile pages', () => {
                expect(isAnalyticsEnabledPage('/app/profile')).toBe(false);
                expect(isAnalyticsEnabledPage('/app/profile/')).toBe(false);
                expect(isAnalyticsEnabledPage('/app/profile/edit')).toBe(false);
            });

            it('should disable analytics on dashboard', () => {
                expect(isAnalyticsEnabledPage('/app/dashboard')).toBe(false);
                expect(isAnalyticsEnabledPage('/app/dashboard/')).toBe(false);
            });

            it('should disable analytics on login page', () => {
                expect(isAnalyticsEnabledPage('/app/login')).toBe(false);
                expect(isAnalyticsEnabledPage('/app/login/')).toBe(false);
            });

            it('should disable analytics on signup page', () => {
                expect(isAnalyticsEnabledPage('/app/signup')).toBe(false);
                expect(isAnalyticsEnabledPage('/app/signup/')).toBe(false);
            });
        });
    });

    describe('Ads routing', () => {
        describe('Ads should display on ad-enabled pages only', () => {
            it('should enable ads on homepage', () => {
                expect(isAdEnabledPage('/')).toBe(true);
            });

            it('should enable ads on blog index', () => {
                expect(isAdEnabledPage('/blog')).toBe(true);
                expect(isAdEnabledPage('/blog/')).toBe(true);
            });

            it('should enable ads on blog posts', () => {
                expect(isAdEnabledPage('/blog/my-post')).toBe(true);
                expect(isAdEnabledPage('/blog/another-post/')).toBe(true);
                expect(isAdEnabledPage('/blog/nested/post')).toBe(true);
            });

            it('should enable ads on app index', () => {
                expect(isAdEnabledPage('/app')).toBe(true);
                expect(isAdEnabledPage('/app/')).toBe(true);
            });

            it('should enable ads on messages page', () => {
                expect(isAdEnabledPage('/app/messages')).toBe(true);
                expect(isAdEnabledPage('/app/messages/')).toBe(true);
            });
        });

        describe('Ads should NOT display on ad-excluded pages', () => {
            it('should disable ads on admin pages', () => {
                expect(isAdEnabledPage('/app/admin')).toBe(false);
                expect(isAdEnabledPage('/app/admin/')).toBe(false);
                expect(isAdEnabledPage('/app/admin/users')).toBe(false);
            });

            it('should disable ads on profile pages', () => {
                expect(isAdEnabledPage('/app/profile')).toBe(false);
                expect(isAdEnabledPage('/app/profile/')).toBe(false);
                expect(isAdEnabledPage('/app/profile/123')).toBe(false);
            });

            it('should disable ads on dashboard', () => {
                expect(isAdEnabledPage('/app/dashboard')).toBe(false);
                expect(isAdEnabledPage('/app/dashboard/')).toBe(false);
            });

            it('should disable ads on login page', () => {
                expect(isAdEnabledPage('/app/login')).toBe(false);
                expect(isAdEnabledPage('/app/login/')).toBe(false);
            });

            it('should disable ads on signup page', () => {
                expect(isAdEnabledPage('/app/signup')).toBe(false);
                expect(isAdEnabledPage('/app/signup/')).toBe(false);
            });

            it('should disable ads on settings page', () => {
                expect(isAdEnabledPage('/app/settings')).toBe(false);
                expect(isAdEnabledPage('/app/settings/')).toBe(false);
            });

            it('should disable ads on contact page', () => {
                expect(isAdEnabledPage('/contact')).toBe(false);
                expect(isAdEnabledPage('/contact/')).toBe(false);
            });

            it('should disable ads on help page', () => {
                expect(isAdEnabledPage('/help')).toBe(false);
                expect(isAdEnabledPage('/help/')).toBe(false);
            });

            it('should disable ads on privacy page', () => {
                expect(isAdEnabledPage('/privacy')).toBe(false);
                expect(isAdEnabledPage('/privacy/')).toBe(false);
            });

            it('should disable ads on terms page', () => {
                expect(isAdEnabledPage('/terms')).toBe(false);
                expect(isAdEnabledPage('/terms/')).toBe(false);
            });
        });

        describe('Blog post routes should be correctly identified', () => {
            it('should enable ads on various blog post formats', () => {
                expect(isAdEnabledPage('/blog/post-1')).toBe(true);
                expect(isAdEnabledPage('/blog/post-with-dashes')).toBe(true);
                expect(isAdEnabledPage('/blog/2024/01/post')).toBe(true);
                expect(isAdEnabledPage('/blog/category/subcategory/post')).toBe(true);
            });

            it('should handle blog routes with trailing slashes', () => {
                expect(isAdEnabledPage('/blog/post/')).toBe(true);
                expect(isAdEnabledPage('/blog/nested/post/')).toBe(true);
            });
        });
    });
});
