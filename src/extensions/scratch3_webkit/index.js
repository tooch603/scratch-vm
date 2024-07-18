const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const log = require("../../util/log");

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNjAuMDAwMDAwcHQiIGhlaWdodD0iNjAuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA2MC4wMDAwMDAgNjAuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCw2MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik01MTUgNTMwIGMtNCAtNiAtMTIgLTcgLTE4IC00IC03IDQgLTkgNCAtNSAtMSA0IC00IDQgLTEzIC0xIC0xOSAtNgotNyAtMiAtMTEgMTIgLTExIDE2IDAgMjIgNyAyMyAyMyAyIDI0IC0xIDI4IC0xMSAxMnoiLz4KPHBhdGggZD0iTTQxMiA1MTAgYzAgLTE0IDIgLTE5IDUgLTEyIDIgNiAyIDE4IDAgMjUgLTMgNiAtNSAxIC01IC0xM3oiLz4KPHBhdGggZD0iTTM1OCA0OTMgYzcgLTMgMTYgLTIgMTkgMSA0IDMgLTIgNiAtMTMgNSAtMTEgMCAtMTQgLTMgLTYgLTZ6Ii8+CjxwYXRoIGQ9Ik04MCA0MDAgYzAgLTI3IDIxIC05MCAyOSAtOTAgNSAwIDEzIDE3IDE4IDM4IGwxMCAzNyA4IC0zNyBjNCAtMjEKMTEgLTM4IDE2IC0zOCA1IDAgOSAxIDkgMyAwIDEgNyAyMyAxNSA1MCA4IDI2IDEwIDQ3IDYgNDcgLTUgMCAtMTIgLTE3IC0xNgotMzcgbC04IC0zOCAtMTEgMzIgYy0xNiA0NiAtMjUgNTAgLTMyIDE1IC03IC0zNCAtMjQgLTQ0IC0yNCAtMTQgMCA5IC01IDI0Ci0xMCAzMiAtOSAxMyAtMTAgMTMgLTEwIDB6Ii8+CjxwYXRoIGQ9Ik0yOTAgMzYwIGMwIC00NiAyIC01MCAyNCAtNTAgMTMgMCAyOSA3IDM2IDE1IDE2IDE5IDMgNTUgLTIxIDU1IC0xMAowIC0xOSA3IC0xOSAxNSAwIDggLTQgMTUgLTEwIDE1IC01IDAgLTEwIC0yMiAtMTAgLTUweiBtNTAgLTE1IGMwIC0xNiAtNiAtMjUKLTE1IC0yNSAtOSAwIC0xNSA5IC0xNSAyNSAwIDE2IDYgMjUgMTUgMjUgOSAwIDE1IC05IDE1IC0yNXoiLz4KPHBhdGggZD0iTTIxNCAzNjYgYy0xMiAtMzAgMSAtNTEgMzEgLTUzIDE4IC0xIDIyIDEgMTAgNCAtMzQgOSAtNDEgMjMgLTEyIDIzCjIwIDAgMjcgNSAyNyAyMCAwIDE1IC03IDIwIC0yNSAyMCAtMTQgMCAtMjggLTYgLTMxIC0xNHogbTQzIC0yIGMtMyAtMyAtMTIKLTQgLTE5IC0xIC04IDMgLTUgNiA2IDYgMTEgMSAxNyAtMiAxMyAtNXoiLz4KPHBhdGggZD0iTTMwMCAyMDAgYzAgLTI3IDUgLTUwIDEwIC01MCA2IDAgMTAgNyAxMCAxNyAwIDE1IDEgMTUgMTggMCAyNiAtMjQKMzkgLTIxIDE3IDMgLTE1IDE2IC0xNSAyMiAtNSAzNSAxNSAxOCAtMSAyMCAtMTggMyAtOSAtOSAtMTIgLTYgLTEyIDE1IDAgMTUKLTQgMjcgLTEwIDI3IC01IDAgLTEwIC0yMiAtMTAgLTUweiIvPgo8cGF0aCBkPSJNMzgwIDIzOSBjMCAtNSA1IC03IDEwIC00IDYgMyAxMCA4IDEwIDExIDAgMiAtNCA0IC0xMCA0IC01IDAgLTEwCi01IC0xMCAtMTF6Ii8+CjxwYXRoIGQ9Ik00MTggMjMwIGMtMiAtNyAtMiAtMjcgMCAtNDYgMyAtMjcgOCAtMzQgMjYgLTMzIDE2IDEgMTcgMiA0IDYgLTI0CjYgLTI0IDUzIDAgNTQgMTMgMCAxNCAyIDIgNiAtOCAzIC0xOCAxMCAtMjEgMTYgLTQgNSAtOCA0IC0xMSAtM3oiLz4KPHBhdGggZD0iTTM4MyAxODUgYzAgLTIyIDIgLTMwIDQgLTE3IDIgMTIgMiAzMCAwIDQwIC0zIDkgLTUgLTEgLTQgLTIzeiIvPgo8L2c+Cjwvc3ZnPgo=";

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNjAuMDAwMDAwcHQiIGhlaWdodD0iNjAuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCA2MC4wMDAwMDAgNjAuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCw2MC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik01MTUgNTMwIGMtNCAtNiAtMTIgLTcgLTE4IC00IC03IDQgLTkgNCAtNSAtMSA0IC00IDQgLTEzIC0xIC0xOSAtNgotNyAtMiAtMTEgMTIgLTExIDE2IDAgMjIgNyAyMyAyMyAyIDI0IC0xIDI4IC0xMSAxMnoiLz4KPHBhdGggZD0iTTQxMiA1MTAgYzAgLTE0IDIgLTE5IDUgLTEyIDIgNiAyIDE4IDAgMjUgLTMgNiAtNSAxIC01IC0xM3oiLz4KPHBhdGggZD0iTTM1OCA0OTMgYzcgLTMgMTYgLTIgMTkgMSA0IDMgLTIgNiAtMTMgNSAtMTEgMCAtMTQgLTMgLTYgLTZ6Ii8+CjxwYXRoIGQ9Ik04MCA0MDAgYzAgLTI3IDIxIC05MCAyOSAtOTAgNSAwIDEzIDE3IDE4IDM4IGwxMCAzNyA4IC0zNyBjNCAtMjEKMTEgLTM4IDE2IC0zOCA1IDAgOSAxIDkgMyAwIDEgNyAyMyAxNSA1MCA4IDI2IDEwIDQ3IDYgNDcgLTUgMCAtMTIgLTE3IC0xNgotMzcgbC04IC0zOCAtMTEgMzIgYy0xNiA0NiAtMjUgNTAgLTMyIDE1IC03IC0zNCAtMjQgLTQ0IC0yNCAtMTQgMCA5IC01IDI0Ci0xMCAzMiAtOSAxMyAtMTAgMTMgLTEwIDB6Ii8+CjxwYXRoIGQ9Ik0yOTAgMzYwIGMwIC00NiAyIC01MCAyNCAtNTAgMTMgMCAyOSA3IDM2IDE1IDE2IDE5IDMgNTUgLTIxIDU1IC0xMAowIC0xOSA3IC0xOSAxNSAwIDggLTQgMTUgLTEwIDE1IC01IDAgLTEwIC0yMiAtMTAgLTUweiBtNTAgLTE1IGMwIC0xNiAtNiAtMjUKLTE1IC0yNSAtOSAwIC0xNSA5IC0xNSAyNSAwIDE2IDYgMjUgMTUgMjUgOSAwIDE1IC05IDE1IC0yNXoiLz4KPHBhdGggZD0iTTIxNCAzNjYgYy0xMiAtMzAgMSAtNTEgMzEgLTUzIDE4IC0xIDIyIDEgMTAgNCAtMzQgOSAtNDEgMjMgLTEyIDIzCjIwIDAgMjcgNSAyNyAyMCAwIDE1IC03IDIwIC0yNSAyMCAtMTQgMCAtMjggLTYgLTMxIC0xNHogbTQzIC0yIGMtMyAtMyAtMTIKLTQgLTE5IC0xIC04IDMgLTUgNiA2IDYgMTEgMSAxNyAtMiAxMyAtNXoiLz4KPHBhdGggZD0iTTMwMCAyMDAgYzAgLTI3IDUgLTUwIDEwIC01MCA2IDAgMTAgNyAxMCAxNyAwIDE1IDEgMTUgMTggMCAyNiAtMjQKMzkgLTIxIDE3IDMgLTE1IDE2IC0xNSAyMiAtNSAzNSAxNSAxOCAtMSAyMCAtMTggMyAtOSAtOSAtMTIgLTYgLTEyIDE1IDAgMTUKLTQgMjcgLTEwIDI3IC01IDAgLTEwIC0yMiAtMTAgLTUweiIvPgo8cGF0aCBkPSJNMzgwIDIzOSBjMCAtNSA1IC03IDEwIC00IDYgMyAxMCA4IDEwIDExIDAgMiAtNCA0IC0xMCA0IC01IDAgLTEwCi01IC0xMCAtMTF6Ii8+CjxwYXRoIGQ9Ik00MTggMjMwIGMtMiAtNyAtMiAtMjcgMCAtNDYgMyAtMjcgOCAtMzQgMjYgLTMzIDE2IDEgMTcgMiA0IDYgLTI0CjYgLTI0IDUzIDAgNTQgMTMgMCAxNCAyIDIgNiAtOCAzIC0xOCAxMCAtMjEgMTYgLTQgNSAtOCA0IC0xMSAtM3oiLz4KPHBhdGggZD0iTTM4MyAxODUgYzAgLTIyIDIgLTMwIDQgLTE3IDIgMTIgMiAzMCAwIDQwIC0zIDkgLTUgLTEgLTQgLTIzeiIvPgo8L2c+Cjwvc3ZnPgo=";

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Webkit {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: "webkit",
            name: "Web kit",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "writeLog",
                    blockType: BlockType.COMMAND,
                    text: "alert [TEXT]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Scratch",
                        },
                    },
                },
                {
                    opcode: "writeConfirm",
                    text: "confirm [TEXT]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Do you like scratch?",
                        },
                    },
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: "writePrompt",
                    text: "prompt [TEXT] with defalt value of [ANS]",
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "What's your name?",
                        },
                        ANS: {
                            type: ArgumentType.STRING,
                            defaultValue: "",
                        },
                    },
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: "reload",
                    text: "reload",
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "close",
                    text: "close",
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "open",
                    text: "open [URL]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            defaultValue: window.location.href,
                            type: ArgumentType.STRING,
                        },
                    },
                },
                {
                    opcode: "replace",
                    text: "replace the URL with [URL]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            defaultValue: window.location.href,
                            type: ArgumentType.STRING,
                        },
                    },
                },
                {
                    opcode: "allways",
                    text: "on start",
                    blockType: BlockType.HAT,
                    isEdgeActivated: true,
                },
                {
                    opcode: "ifReturn",
                    text: "if [BOOLEAN] then return [TRUETEXT], if not then return[FALSETEXT]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BOOLEAN: {
                            defaultValue: true,
                            type: ArgumentType.BOOLEAN,
                        },
                        TRUETEXT: {
                            defaultValue: "Scratcher",
                            type: ArgumentType.STRING,
                        },
                        FALSETEXT: {
                            defaultValue: "New Scratcher",
                            type: ArgumentType.STRING,
                        },
                    },
                },
                {
                    opcode: "True",
                    text: "true",
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: "False",
                    text: "false",
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: "Text",
                    text: "[TEXT]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TEXT: {
                            defaultValue: "",
                            type: ArgumentType.STRING,
                        },
                    },
                },
                {
                    opcode: "Eval",
                    text: "eval [SCRIPT]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        SCRIPT: {
                            defaultValue: "alert('scratch!!')",
                            type: ArgumentType.STRING,
                        },
                    },
                },
            ],
            menus: {},
        };
    }

    /**
     * alert.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     */
    writeLog(args) {
        const text = Cast.toString(args.TEXT);
        alert(text);
    }

    /**
     * confirm.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     * @return {boolean} - the user agent.
     */
    writeConfirm(args) {
        const text = Cast.toString(args.TEXT);
        return confirm(text);
    }
    open(args) {
        const url = Cast.toString(args.URL);
        window.open(url);
    }
    replace(args) {
        const url = Cast.toString(args.URL);
        location.replace(url);
    }
    /**
     * confirm.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     * @return {string} - the user agent.
     */
    writePrompt(args) {
        const text = Cast.toString(args.TEXT);
        const ans = Cast.toString(args.ANS);
        if (ans) {
            const a = prompt(text, ans);
            if (a != null) {
                return a;
            } else {
                return false;
            }
        } else {
            return prompt(text);
        }
    }
    reload() {
        location.reload();
    }
    close() {
        window.close();
    }
    allways() {
        return true;
    }
    ifReturn(args) {
        const _boolean = Cast.toBoolean(args.BOOLEAN);
        const trueText = Cast.toString(args.TRUETEXT);
        const falseText = Cast.toString(args.FALSETEXT);
        return _boolean ? trueText : falseText;
    }
    True() {
        return true;
    }
    False() {
        return false;
    }
    Text(args) {
        return Cast.toString(args.TEXT);
    }
    Eval(args) {
        try {
            return eval(Cast.toString(args.SCRIPT));
        } catch (error) {
            return error.toString();
        }
    }
}

module.exports = Scratch3Webkit;
