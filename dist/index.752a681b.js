ace.define("ace/mode/brolang", [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/mode/text_highlight_rules"
], function(require, exports, module) {
    const oop = require("ace/lib/oop");
    const TextMode = require("ace/mode/text").Mode;
    const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
    const BroLangHighlightRules = function() {
        this.$rules = {
            start: [
                {
                    token: "keyword",
                    regex: "\\b(?:yo|brofunc|bounce|spill|if|else|forEvery|squadGoals)\\b"
                },
                {
                    token: "constant.language.boolean",
                    regex: /(?:dope|nope)\b/
                },
                {
                    token: "constant.numeric",
                    regex: "\\b\\d+\\b"
                },
                {
                    token: "string",
                    regex: '".*?"'
                },
                {
                    token: "comment",
                    regex: "//.*$"
                },
                {
                    token: "comment",
                    start: "/\\*",
                    end: "\\*/"
                }
            ]
        };
    };
    oop.inherits(BroLangHighlightRules, TextHighlightRules);
    const BroLangMode = function() {
        this.HighlightRules = BroLangHighlightRules;
    };
    oop.inherits(BroLangMode, TextMode);
    (function() {
        this.lineCommentStart = "//";
        this.blockComment = {
            start: "/*",
            end: "*/"
        };
    }).call(BroLangMode.prototype);
    exports.Mode = BroLangMode;
});

//# sourceMappingURL=index.752a681b.js.map
