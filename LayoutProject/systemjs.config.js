(function (global) {
    System.config({
        defaultJSExtensions: true,
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        map: {
            'app': 'app',
            // '@angular': 'scripts/angular2',
            
            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

            // other libraries
            'rxjs': 'node_modules/rxjs',
            // ag libraries
            'ag-grid-angular': 'node_modules/ag-grid-angular',
            'ag-grid': 'node_modules/ag-grid',
            'ag-grid-enterprise': 'node_modules/ag-grid-enterprise',
            'angular-in-memory-web-api': 'node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
        },
        packages: {
            app: {
                defaultExtension: 'js',
                main: 'main.js',
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'ag-grid': {
                main: 'main.js'
            },
            'ag-grid-angular': {
                main: 'main.js'
            }
        }
    }
    );
})(this);