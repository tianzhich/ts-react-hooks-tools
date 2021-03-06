import * as assert from 'assert';
import * as vscode from 'vscode';

import {
    createTestEditor,
    executeAndCompareCodeActionBewteenLabel,
    executeAndCompareCodeActionInLine,
    executeAndNotExistCodeActionBewteenLabel,
    projectFile,
    wait
} from '../../tesUtils';
import { wrapIntoUseMemoActionDescription } from '../../../../src/constants';

suite('Use memo test', async () => {
    suiteSetup(async () => {
        await wait(1000);

        await vscode.workspace
            .getConfiguration('trht')
            .update('preferFullAccess', true);
        await vscode.workspace
            .getConfiguration('trht')
            .update('preferImmutableCall', true);
    });

    teardown(async () => {
        await vscode.commands.executeCommand(
            'workbench.action.closeAllEditors'
        );
    });

    test('Should work', async () => {
        const file = projectFile('cases/useMemo/shouldWork.tsx');
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionBewteenLabel(
            file,
            editor,
            'a',
            'b',
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            'const value = React.useMemo(() => 1 + 2 + 3, []);'
        );
    });

    test('Should work with JSX element', async () => {
        const file = projectFile('cases/useMemo/shouldWorkWithJsxElement.tsx');
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionInLine(
            file,
            editor,
            5,
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            '{React.useMemo(() => <span>Foo</span>, [])}'
        );
    });

    test('Should work with deps', async () => {
        const file = projectFile('cases/useMemo/shouldWorkWithDeps.tsx');
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionInLine(
            file,
            editor,
            11,
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            '{React.useMemo(() => <span>{value}</span>, [value])}'
        );
    });

    test('Should work with constants - value', async () => {
        const file = projectFile(
            'cases/useMemo/shouldWorkWithConstatnValue.tsx'
        );
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionInLine(
            file,
            editor,
            10,
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            '{React.useMemo(() => <span>{state + topLevelConstant + outsideValue}</span>, [state])}'
        );
    });

    test('Should work with constants - function', async () => {
        const file = projectFile(
            'cases/useMemo/shouldWorkWithConstatnFunction.tsx'
        );
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionInLine(
            file,
            editor,
            7,
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            '{React.useMemo(() => <span>{renderSomething()}</span>, [])}'
        );
    });

    test('Should not work with overlapped hooks', async () => {
        const file = projectFile('cases/useMemo/shouldNotWorkOverlap.tsx');
        const editor = await createTestEditor(file);
        await executeAndNotExistCodeActionBewteenLabel(
            file,
            editor,
            'a',
            'b',
            wrapIntoUseMemoActionDescription
        );
    });

    test('Should work with named import', async () => {
        const file = projectFile('cases/useMemo/shouldWorkWithNamedImport.tsx');
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionBewteenLabel(
            file,
            editor,
            'a',
            'b',
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            'const value = useMemo(() => 1 + 2 + 3, []);'
        );
    });

    test('Should work with fake hooks', async () => {
        const file = projectFile('cases/useMemo/shouldWorkWithFakeHooks.tsx');
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionBewteenLabel(
            file,
            editor,
            'a',
            'b',
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            'const value = React.useMemo(() => 1 + 2 + 3, []);'
        );
    });

    test('Should work with unknown or any', async () => {
        const file = projectFile(
            'cases/useMemo/shouldWorkCorrectWithUnknownSymbol.tsx'
        );
        const editor = await createTestEditor(file);
        const result = await executeAndCompareCodeActionBewteenLabel(
            file,
            editor,
            'a',
            'b',
            wrapIntoUseMemoActionDescription
        );
        assert.strictEqual(
            result,
            'const value = React.useMemo(() => 1 + 2 + props.value.foo.a, [props.value.foo.a]);'
        );
    });
});
