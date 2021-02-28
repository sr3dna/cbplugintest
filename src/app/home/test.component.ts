import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { CouchBase } from "@triniwiz/nativescript-couchbase";
import { ObservableArray } from "@nativescript/core";

@Component({
    selector: "test",
    templateUrl: "./test.component.html"
})
export class TestComponent implements OnInit, OnDestroy {

    private cbdatabase: CouchBase;

    public listData: ObservableArray<string> = new ObservableArray([]);

    constructor(private routerExtensions: RouterExtensions) {
    }

    ngOnInit(): void {
        console.log("ngOnInit...");
        this.initCouchbase();
        this.addDataChangeListener();
    }

    initCouchbase() {
        if (!this.cbdatabase) {
            this.cbdatabase = new CouchBase('my-database');
        }
        else {
            console.log("Couchbase already initialized.");
        }
    }

    changeHandler(changes: string[], listData: ObservableArray<string>) {
        console.log(`DataChange observed.`);
        for (var i = 0; i < changes.length; i++) {
            const documentId = changes[i];
            console.log(`Changed doc: ${documentId}`);
            listData.push(documentId);
          }
    }

    addDataChangeListener() {
        let callback = (ids) => this.changeHandler(ids, this.listData);
        this.cbdatabase.addDatabaseChangeListener(callback);
    }

    removeDataChangeListener() {
        let callback = (ids) => this.changeHandler(ids, this.listData);
        this.cbdatabase.removeDatabaseChangeListener(callback);
    }

    AddDoc() {
        let randomstring = String(Math.floor(Math.random() * 1000000));
        const documentId = this.cbdatabase.createDocument({
            "firstname": randomstring,
            "lastname": randomstring,
        });
        console.log(`Added doc to local couchbase lite. ${randomstring}`);
    }

    goBack(): void {
        this.cleanup();
        this.routerExtensions.back();
    }

    cleanup() {
        this.removeDataChangeListener();
        console.log("unsubscribed Couchbase Data Change");
    }

    ngOnDestroy() {
        this.cleanup();
        console.log("Test Component Destroyed");
    }

}
