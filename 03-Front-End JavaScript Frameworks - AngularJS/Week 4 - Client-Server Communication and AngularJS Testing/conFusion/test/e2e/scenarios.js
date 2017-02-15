"use strict";

describe('conFusion App E2E Testing', function() {
    it('should automatically redirect to / when location hash/fragment is empty', function() {
        browser.get('index.html');
        expect(browser.getCurrentUrl()).toMatch("/"); // browser.getLocationAbsUrl() is deprecated
    });
    
    describe('index', function() {
        beforeEach(function() {
            // If using Angular@1.5 -> "" was the default hash-prefix for hash-bang URLs BEFORE Angular 1.6
            //browser.get('index.html#/');
            
            // If using Angular@1.6 -> "!" is the default hash-prefix for hash-bang URLs SINCE Angular 1.6
            browser.get('index.html#!/');
        });

        it('should have a title', function() {
            expect(browser.getTitle()).
            toEqual('Ristorante Con Fusion');
        });
    });
    
    describe('menu 0 item', function() {
        beforeEach(function() {
            // If using Angular@1.5 -> "" was the default hash-prefix for hash-bang URLs BEFORE Angular 1.6
            // Or if using Angular@1.6 -> inject $locationProvider and define $locationProvider.hashPrefix(""); in "app.js"
            //browser.get('index.html#/menu/0');
            
            // If using Angular@1.6 -> "!" is the default hash-prefix for hash-bang URLs SINCE Angular 1.6
            browser.get('index.html#!/menu/0');
        });

        it('should have a name', function() {
            var name = element(by.binding('dish.name'));
            expect(name.getText())
                .toEqual('Uthapizza Hot $4.99');
        });

        it('should show the number of comments as', function() {
            expect(element.all(by.repeater('comment in dish.comments'))
                .count()).toEqual(6); // 6 instead of 5 because of the comment committed in the previous lesson
        });

        it('should show the first comment author as', function() {
            // Reorder the comments based on the authors name - I used ng-model "filtText" instead of "orderText"
            element(by.model('filtText')).sendKeys('author');
            
            // Extracting the first author of the previously ordered list
            var author = element.all(by.repeater('comment in dish.comments'))
                .first().element(by.binding('comment.author'));
            expect(author.getText()).toContain('25 Cent');
        });
    });
});