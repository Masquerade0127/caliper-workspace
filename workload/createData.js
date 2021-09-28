'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.donorIDArray = [];
    }
    
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        /* for (let i=0; i<this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating asset ${assetID}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'CreateAsset',
                invokerIdentity: 'User1',
                contractArguments: [assetID,'blue','20','penguin','500'],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }*/
    }
    
    async submitTransaction() {
        const donorID = Math.floor(Math.random()*this.roundArguments.donorID);

        this.donorIDArray.push(donorID);
        
        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'createProfile',
            invokerIdentity: 'User1',
            contractArguments: [donorID,'name','age','dob','bloodType','amount'],
            readOnly: false
        };
        
        
        await this.sutAdapter.sendRequests(request);
    }
    
    async cleanupWorkloadModule() {
        for(let id in this.donorIDArray){
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'deleteProfile',
                invokerIdentity: 'User1',
                contractArguments: [this.donorIDArray[id]],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }

        
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;