import * as proc from 'process';
import * as fs from 'fs';
import * as path from 'path';
import * as equal from 'fast-deep-equal';
import { handler } from './index';
import { RequestEnvelope } from 'ask-sdk-model';

declare type Test = {
	filename: string;
	input: object;
	expected: object;
}

declare type Result = {
	filename: string;
	status: 'passed' | 'failed';
	expected?: object;
	got?: object;
}

class Results {
	failed: Result[];
	passed: Result[];
	
	constructor() {
		this.passed = [];
		this.failed = [];
	}
}

main();

function main() {
	const testDir = proc.argv[2];
	const filePaths = validateTestDir(testDir);
	const testCases = validateTestCases(testDir, filePaths);
	runTests(testCases).then(report);
}

function runTests(testCases: Test[]): Promise<Results> {
	return new Promise<Results>((resolve) => {
		let results: Results = new Results();
		let promiseArray: Array<Promise<any>> = [];
		testCases.forEach((testCase: Test) => {
			promiseArray.push(new Promise<void>((resolve) => {
				handler(<RequestEnvelope>testCase.input, null, (err: Error, testResult: any) => {
					if(equal(testResult.response, testCase.expected)) {
						results.passed.push({
							filename: testCase.filename,
							status: "passed"
						});
					} else {
						results.failed.push({
							filename: testCase.filename,
							status: "failed",
							expected: testCase.expected,
							got: testResult
						});
					}
					resolve();
				});
			}))
		});
		
		Promise.all(promiseArray).then(() => resolve(results));
	});
	
	
}

function validateTestDir(path: string): string[] {
	if(!fs.statSync(path).isDirectory()) throw new Error("You need to supply a directory path for your test cases");
	
	let filePaths: string[] = [];
	const items: string[] = fs.readdirSync(path);
	items.forEach((item: string) => {
		if(!item.endsWith(".json")) throw new Error("Test cases can only be JSON files");
		filePaths.push(item);
	});
	
	return filePaths;
}

function validateTestCases(basePath: string, paths: string[]): Test[] {
	
	let testArray: Test[] = [];
	
	paths.forEach((filename: string) => {
		const fullPath = path.resolve(__dirname, basePath, filename);
		const testCaseContent: string = fs.readFileSync(fullPath, {encoding: 'utf8'});
		let testCase: Test;
		try {
			testCase = JSON.parse(testCaseContent);
			testCase.filename = filename;
		} catch (e) {
			throw new Error("Your test cases must be valid JSON: " + e.toString())
		}
		
		if(!testCase.hasOwnProperty("input") || !testCase.hasOwnProperty("expected")) {
			throw new Error("Your test case must have an 'input' property and an 'expected' property");
		}
		
		testArray.push(testCase);
	});
	
	return testArray;
}

function report(results: Results): void {
	const verbose = !!proc.argv[3] && (proc.argv[3] === "--verbose" || proc.argv[3] === "-v");
	
	if(results.failed.length > 0) {
		console.warn(`${results.failed.length} failing tests!` + '\n');
		results.failed.forEach(failure => {
			console.log(failure.filename + '\n');
			if(verbose) {
				console.log(`expected: ${JSON.stringify(failure.expected, null, 4)}` + '\n');
				console.log(`got: ${JSON.stringify(failure.got, null, 4)}` + '\n');
			}
		});
	} else {
		console.log(`All ${results.passed.length} tests passed!`);
	}
	
}