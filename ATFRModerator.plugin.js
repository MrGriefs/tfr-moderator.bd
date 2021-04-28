/**
 * @name ATFRModerator
 * @authorId 291656468493631488
 * @website https://github.com/mrgriefs/tfr-moderator.bd/tree/master/ATFRModerator.plugin.js
 * @source https://raw.githubusercontent.com/mrgriefs/tfr-moderator.bd/master/ATFRModerator.plugin.js
 * @updateUrl https://raw.githubusercontent.com/mrgriefs/tfr-moderator.bd/master/ATFRModerator.plugin.js
 */
 let serverId = '368557500884189186';
 let cmdsCId = '682941933777322034';
 let huCmdsCId = '761186029033619476';
 let permRoles = {
     '*': '725082357882683452',
     'F': '725111749648580618',
     'E': '645783671978196992',
     'D': '660668318142693416',
     'C': '701973489329897562',
     'B': '701973582347108402',
     'A': '700320050422349864',
     '1': '670383526100860938',
     '0': '674411116927123476'
 };
 var autowelcomeMessages = [
     'Welcome to The Furry Refuge, {{user}}!',
     'Welcome to The Furry Refuge, we hope you have a great stay. {{user}}',
     'Welcome {{user}}, make sure to select some roles from <#645783730559909908> and read the <#725856136065974322> for more information.',
     'Thanks for popping in, {{user}}, we hope you have a great time in The Furry Refuge.\nIn the meantime, try getting some roles <#645783730559909908> and saying "Hello"!',
     'Who\'s there? Oh, it\'s just you, {{user}}! Get started by getting some freebie roles from <#645783730559909908>.',
     'Amazing of you to pop in, {{user}}. Enjoy your stay and make some best buddies! Get some roles from <#645783730559909908> to get access to the rest of the server :P'
 ];
 var autosanctionMessages = [
     'Targeted harassment towards specific groups or individuals is prohibited.',
     'Intentions of instigating, manipulating or provoking others\' emotions for amusement or purposeful posts of inflammatory and digressive or extraneous messages is prohibited.',
     'You have been removed from the server due to suspicious activity.',
     'This is not a hook-up server.',
     'Offensive or racist language or content, discriminatory jokes and hate speech is prohibited.',
     'Depictions of morbid, sickening, unsettling or life-threatening content is not allowed.',
     'NSFW content is not allowed within the server.',
     'Harassment of individuals, organisations, certain groups and other entities is not tolerated.',
     'Posts containing, portraying, promoting or describing extremely sensitive and/or controversial topics are not allowed.',
     'Content portraying any type of sexual activity is not allowed.',
 ];
 const APIFunctions = {
     _getOriginJoinDate:function(invites){
         if (invites === Object) invites = Object.values(invites);
         if (!Array.isArray(invites)) throw new Error('Invalid invite');
         if (invites.length == 0) return null;
         invites.sort((a, b) => a.origin.timestamp - b.origin.timestamp);
         return new Date(invites[0].origin.timestamp);
     },
     _getOriginInvite:function(invites){
         if (invites === Object) invites = Object.values(invites);
         if (!Array.isArray(invites)) throw new Error('Invalid invite');
         if (invites.length == 0) return null;
         invites.sort((a, b) => a.origin.timestamp - b.origin.timestamp);
         return invites[0];
     }
 };
 function disambiguation(items, label, property = 'name') {
     const itemList = items.map(item => `\`${(property ? item[property] : item).replace(/ /g, '\xa0')}\``).join(', ');
     return `Multiple ${label} found, please be more specific: ${itemList}`;
 }
 
 function escapeMarkdown(
     text,
     {
       codeBlock = true,
       inlineCode = true,
       bold = true,
       italic = true,
       underline = true,
       strikethrough = true,
       spoiler = true,
       codeBlockContent = true,
       inlineCodeContent = true,
     } = {},
   ) {
     if (!codeBlockContent) {
       return text
         .split('```')
         .map((subString, index, array) => {
           if (index % 2 && index !== array.length - 1) return subString;
           return Util.escapeMarkdown(subString, {
             inlineCode,
             bold,
             italic,
             underline,
             strikethrough,
             spoiler,
             inlineCodeContent,
           });
         })
         .join(codeBlock ? '\\`\\`\\`' : '```');
     }
     if (!inlineCodeContent) {
       return text
         .split(/(?<=^|[^`])`(?=[^`]|$)/g)
         .map((subString, index, array) => {
           if (index % 2 && index !== array.length - 1) return subString;
           return Util.escapeMarkdown(subString, {
             codeBlock,
             bold,
             italic,
             underline,
             strikethrough,
             spoiler,
           });
         })
         .join(inlineCode ? '\\`' : '`');
     }
     if (inlineCode) text = Util.escapeInlineCode(text);
     if (codeBlock) text = Util.escapeCodeBlock(text);
     if (italic) text = Util.escapeItalic(text);
     if (bold) text = Util.escapeBold(text);
     if (underline) text = Util.escapeUnderline(text);
     if (strikethrough) text = Util.escapeStrikethrough(text);
     if (spoiler) text = Util.escapeSpoiler(text);
     return text;
   }
 
 module.exports = (_ => {
     const config = {
         "info": {
             "name": "ATFRModerator",
             // "displayName": "0TFRModerator",
             "author": "Griefs",
             "version": "0.3.2",
             "description": "TFR moderator"
         },
         "rawUrl": "https://raw.githubusercontent.com/mrgriefs/tfr-moderator.bd/master/ATFRModerator.plugin.js",
         "changeLog": {
             // "deprecated": {
             //     "Invite In User Modal": "Invites in user modals has been deprecated due to optimisations flaws."
             // },
             "added": {
                 // "Auto Welcome": "You can now welcome new members by using presets via the `.aw <user> <number>` command. You can view all auto welcome messages via `.help autowelcome`",
                 // "Auto Reason": "You can now add reasons to your sanctions (.ban, .mute, .kick, .warn) simply by using the number of the auto reason. View all autoreasons by using `.help ban` or `.help mute`, etc",
                 // "API Functionality": "Yes! You can now interact with the api.paw.bot API via commands (.revoke, .origin). Make sure to add your token in settings!",
                 // "Invite In User Modal": "The invite a user used will now appear when clicking on a user, so now you can just click on a user to see where they were invited from. This can be disabled any time in settings."
             },
             "fixed": {
             //     "\"Library Missing\"": "The 'Library Missing' appearing when starting Discord even with the library installed and enabled has been fixed."
                 "API Errors": "Fixed some plugin errors that stopped the use of the API."
             }
         }
     };
 
     return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
         getName () {return config.info.name;}
         getAuthor () {return config.info.author;}
         getVersion () {return config.info.version;}
         getDescription () {return config.info.description;}
         
         load() {
             // console.log(config.info.name, 'Main load')
             if (!global.ZeresPluginLibrary) return BdApi.alert("Local version of ZeresPluginLibrary required", "For this plugin to work you need to have the ZeresPluginLibrary plugin installed. " +
             "Please download it from [here](https://betterdiscord.net/ghdl?id=2252) and then disable and reenable this plugin.");
             if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
             if (!window.BDFDB_Global.downloadModal) {
                 window.BDFDB_Global.downloadModal = true;
                 BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
                     confirmText: "Download Now",
                     cancelText: "Cancel",
                     onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
                     onConfirm: _ => {
                         delete window.BDFDB_Global.downloadModal;
                         require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                             if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => {});
                             else BdApi.alert("Error", "Could not download BDFDB library plugin, try again some time later.");
                         });
                     }
                 });
             }
             if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
         }
         start() {
             // console.log(config.info.name, 'Main start')
             this.load();
         }
         stop() {}
     } : (([Plugin, BDFDB]) => {
         let LoadClasses = () => {
             // console.log(config.info.name, 'Loading classes...')
             class APIRequest {
                 constructor(endpoint, ops = {}, p = {baseURL: baseURL, token: token}) {
                     let options = {
                         query: ops.query || {},
                         baseURL: (ops.baseURL || p.baseURL),
                         version: ops.version || 'v1',
                         method: ops.method || 'GET',
                         token: ops.token || p.token,
                     };
                     let { baseURL, version, query, method, token } = options;
                     if (!token) throw new Error('No token provided');
                     if (baseURL[baseURL.length - 1] === '/') baseURL = baseURL.slice(0, baseURL.length - 1);
                     return new Promise((r, e) => {
                         this.request = $.ajax({
                             url: baseURL + `/${version}/` + endpoint,
                             data: query,
                             dataType: 'json',
                             type: method,
                             headers: {
                                 authorization: token,
                             },
                         })
                         .success((e, t, n) => {
                             this.data = n.responseJSON;
                             r(this);
                         })
                         .error((n) => {
                             this.data = n.responseJSON;
                             r(this);
                         })
                     })
                 }
             }
 
             /**
              * Has a message that can be considered user-friendly
              * @extends {Error}
              */
             class FriendlyError extends Error {
                 /** @param {string} message - The error message */
                 constructor(message) {
                     super(message);
                     this.name = 'FriendlyError';
                 }
             }
             
             /**
              * Has a descriptive message for a command not having proper format
              * @extends {FriendlyError}
              */
             class CommandFormatError extends FriendlyError {
                 /**
                  * @param {CommandMessage} msg - The command message the error is for
                  */
                 constructor(msg) {
                     super(
                         `Invalid command usage. The \`${msg.command.name}\` command's accepted format is: ${msg.usage(
                             msg.command.format
                         )}. Use ${msg.anyUsage(
                             `help ${msg.command.name}`
                         )} for more information.`
                     );
                     this.name = 'CommandFormatError';
                 }
             }
             
             class Util {
                 /**
                  * Resolves a StringResolvable to a string.
                  * @param {StringResolvable} data The string resolvable to resolve
                  * @returns {string}
                  */
                 static resolveString(data) {
                     if (typeof data === 'string') return data;
                     if (Array.isArray(data)) return data.join('\n');
                     return String(data);
                 }
             }
 
             class Message {
                 constructor(channel, content, options = {}) {
                     if (content instanceof Object) {
                         options = content;
                     } else {
                         options.content = content;
                     }
                     let send = () => ZLibrary.DiscordModules.MessageActions.sendMessage(channel instanceof Object ? channel.id : channel, options).then(r => {
                         if(r.status == 429){
                             let wait = r.body.retry_after;
                             if(!wait) wait = 1000;
                             console.log("Rate limited, retrying in " + wait + "ms");
                             window.setTimeout(()=>{send();},wait);
                         }
                     });
                     return send();
                 }
             }
             
             /** A container for virtualised messages */
             class VirtualMessage {
                 constructor(channel, content, options = {}) {
                     this.message = ZLibrary.WebpackModules.getByProps('createBotMessage').createBotMessage(channel instanceof Object ? channel.id : channel, content, options.embeds, options.loggingName);
                     this.preset.Invisible();
                     if (options.attachments) this.message.attachments = options.attachments;
                     if (options.tts) this.message.tts = Boolean(options.tts);
                     if (options.author) for (var i in options.author) {
                         this.message.author[i] = options.author[i];
                     }
                     this.channel = ZLibrary.DiscordModules.ChannelStore.getChannel(this.message.channel_id);
                     this.user = ZLibrary.DiscordModules.UserStore.getUser(this.message.author.id);
                     this.guild = this.channel && 'guild_id' in this.channel ? ZLibrary.DiscordModules.GuildStore.getGuild(this.channel.guild_id) : null;
                     this.member = this.guild && 'id' in this.guild && this.user && 'id' in this.user ? ZLibrary.DiscordModules.GuildMemberStore.getMember(this.guild.id, this.user.id) : null;
                     return this;
                 };
                 send() {
                     return ZLibrary.DiscordModules.MessageActions.receiveMessage(this.channel_id, this.message);
                 };
                 get getChannel() {
                     let r = ZLibrary.DiscordModules.ChannelStore.getChannel(this.message.channel_id);
                     if (r) this.channel = r;
                     return r;
                 };
                 get getAuthor() {
                     let r = ZLibrary.DiscordModules.UserStore.getUser(this.message.author.id);
                     if (r) this.user = r;
                     return r;
                 };
                 get getGuild() {
                     let r = this.channel && 'guild_id' in this.channel ? ZLibrary.DiscordModules.GuildStore.getGuild(this.channel.guild_id) : null;
                     if (r) this.guild = r;
                     return r;
                 }
             
                 get preset() {
                     return {
                         'Clyde': () => {
                             this.message.author.username = "Clyde";
                             this.message.author.id = 1;
                             this.message.author.discriminator = '0000';
                             this.message.author.avatar = 'clyde';
                             this.message.author.bot = !0;
                             return this;
                         },
                         'System': () => {
                             this.message.author.username = "System";
                             this.message.author.id = 1;
                             this.message.author.discriminator = '0000';
                             this.message.author.avatar = 'clyde';
                             this.message.author.bot = !0;
                             return this;
                         },
                         'Invisible': () => {
                             this.message.author.username = "\u200A";
                             this.message.author.id = 1;
                             this.message.author.discriminator = '0000';
                             this.message.author.avatar = 'clyde';
                             this.message.author.bot = !0;
                             return this;
                         },
                     }
                 };
             
                 /**
                  * Shortcut to `this.message.channel_id`
                  * @type {string}
                  * @readonly
                  */
                 get channel_id() {
                     return this.message.channel_id;
                 };
             
                 /**
                  * Alternative to `this.user`
                  * @type {Object}
                  * @readonly
                  */
                 get author() {
                     return this.user;
                 };
             }
             
             
             
             
             /** A type for command arguments */
             class ArgumentType {
                 /**
                  * @param {string} id - The argument type ID (this is what you specify in {@link ArgumentInfo#type})
                  */
                 constructor(id) {
                     if(typeof id !== 'string') throw new Error('Argument type ID must be a string.');
                     if(id !== id.toLowerCase()) throw new Error('Argument type ID must be lowercase.');
             
                     /**
                      * ID of this argument type (this is what you specify in {@link ArgumentInfo#type})
                      * @type {string}
                      */
                     this.id = id;
                 }
             
                 // eslint-disable-next-line valid-jsdoc
                 /**
                  * Validates a value string against the type
                  * @param {string} value - Value to validate
                  * @param {CommandMessage} msg - Message the value was obtained from
                  * @param {Argument} arg - Argument the value was obtained from
                  * @return {boolean|string|Promise<boolean|string>} Whether the value is valid, or an error message
                  * @abstract
                  */
                 validate(value, msg, arg) { // eslint-disable-line no-unused-vars
                     throw new Error(`${this.constructor.name} doesn't have a validate() method.`);
                 }
             
                 // eslint-disable-next-line valid-jsdoc
                 /**
                  * Parses the raw value string into a usable value
                  * @param {string} value - Value to parse
                  * @param {CommandMessage} msg - Message the value was obtained from
                  * @param {Argument} arg - Argument the value was obtained from
                  * @return {*|Promise<*>} Usable value
                  * @abstract
                  */
                 parse(value, msg, arg) { // eslint-disable-line no-unused-vars
                     throw new Error(`${this.constructor.name} doesn't have a parse() method.`);
                 }
             
                 /**
                  * Checks whether a value is considered to be empty. This determines whether the default value for an argument
                  * should be used and changes the response to the user under certain circumstances.
                  * @param {string} value - Value to check for emptiness
                  * @param {CommandMessage} msg - Message the value was obtained from
                  * @param {Argument} arg - Argument the value was obtained from
                  * @return {boolean} Whether the value is empty
                  */
                 isEmpty(value, msg, arg) { // eslint-disable-line no-unused-vars
                     return !value;
                 }
             }
             
             /**
              * A type for command arguments that handles multiple other types
              * @extends {ArgumentType}
              */
             class ArgumentUnionType extends ArgumentType {
                 constructor(id) {
                     super(id);
             
                     /**
                      * Types to handle, in order of priority
                      * @type {ArgumentType[]}
                      */
                     this.types = [];
                     const typeIDs = id.split('|');
                     for(const typeID of typeIDs) {
                         const type = registry.types.get(typeID);
                         if(!type) throw new Error(`Argument type "${typeID}" is not registered.`);
                         this.types.push(type);
                     }
                 }
             
                 async validate(value, msg, arg) {
                     let results = this.types.map(type => !type.isEmpty(value, msg, arg) ? type.validate(value, msg, arg) : false);
                     results = await Promise.all(results);
                     if(results.some(valid => valid && typeof valid !== 'string')) return true;
                     const errors = results.filter(valid => typeof valid === 'string');
                     if(errors.length > 0) return errors.join('\n');
                     return false;
                 }
             
                 async parse(value, msg, arg) {
                     let results = this.types.map(type => !type.isEmpty(value, msg, arg) ? type.validate(value, msg, arg) : false);
                     results = await Promise.all(results);
                     for(let i = 0; i < results.length; i++) {
                         if(results[i] && typeof results[i] !== 'string') return this.types[i].parse(value, msg, arg);
                     }
                     throw new Error(`Couldn't parse value "${value}" with union type ${this.id}.`);
                 }
             
                 isEmpty(value, msg, arg) {
                     return !this.types.some(type => !type.isEmpty(value, msg, arg));
                 }
             }
             
             
             /** A fancy argument */
             class Argument {
                 /**
                  * @typedef {Object} ArgumentInfo
                  * @property {string} key - Key for the argument
                  * @property {string} [label=key] - Label for the argument
                  * @property {string} prompt - First prompt for the argument when it wasn't specified
                  * @property {string} [error] - Predefined error message to output for the argument when it isn't valid
                  * @property {string} [type] - Type of the argument (must be the ID of one of the registered argument types
                  * or multiple IDs in order of priority separated by `|` for a union type - see
                  * {@link CommandRegistry#registerDefaultTypes} for the built-in types)
                  * @property {number} [max] - If type is `integer` or `float`, this is the maximum value of the number.
                  * If type is `string`, this is the maximum length of the string.
                  * @property {number} [min] - If type is `integer` or `float`, this is the minimum value of the number.
                  * If type is `string`, this is the minimum length of the string.
                  * @property {ArgumentDefault} [default] - Default value for the argument (makes the arg optional - cannot be `null`)
                  * @property {string[]} [oneOf] - An array of values that are allowed to be used
                  * @property {boolean} [infinite=false] - Whether the argument accepts infinite values
                  * @property {Function} [validate] - Validator function for the argument (see {@link ArgumentType#validate})
                  * @property {Function} [parse] - Parser function for the argument (see {@link ArgumentType#parse})
                  * @property {Function} [isEmpty] - Empty checker for the argument (see {@link ArgumentType#isEmpty})
                  * @property {number} [wait=30] - How long to wait for input (in seconds)
                  */
             
                 /**
                  * Either a value or a function that returns a value. The function is passed the CommandMessage and the Argument.
                  * @typedef {*|Function} ArgumentDefault
                  */
             
                 /**
                  * @param {CommandoClient} client - Client the argument is for
                  * @param {ArgumentInfo} info - Information for the command argument
                  */
                 constructor(client, info) {
                     this.constructor.validateInfo(client, info);
             
                     /**
                      * Key for the argument
                      * @type {string}
                      */
                     this.key = info.key;
             
                     /**
                      * Label for the argument
                      * @type {string}
                      */
                     this.label = info.label || info.key;
             
                     /**
                      * Question prompt for the argument
                      * @type {string}
                      */
                     this.prompt = info.prompt;
             
                     /**
                      * Error message for when a value is invalid
                      * @type {?string}
                      */
                     this.error = info.error || null;
             
                     /**
                      * Type of the argument
                      * @type {?ArgumentType}
                      */
                     this.type = this.constructor.determineType(client, info.type);
             
                     /**
                      * If type is `integer` or `float`, this is the maximum value of the number.
                      * If type is `string`, this is the maximum length of the string.
                      * @type {?number}
                      */
                     this.max = typeof info.max !== 'undefined' ? info.max : null;
             
                     /**
                      * If type is `integer` or `float`, this is the minimum value of the number.
                      * If type is `string`, this is the minimum length of the string.
                      * @type {?number}
                      */
                     this.min = typeof info.min !== 'undefined' ? info.min : null;
             
                     /**
                      * The default value for the argument
                      * @type {?ArgumentDefault}
                      */
                     this.default = typeof info.default !== 'undefined' ? info.default : null;
             
                     /**
                      * Values the user can choose from
                      * If type is `string`, this will be case-insensitive
                      * If type is `channel`, `member`, `role`, or `user`, this will be the IDs.
                      * @type {?string[]}
                      */
                     this.oneOf = typeof info.oneOf !== 'undefined' ? info.oneOf : null;
             
                     /**
                      * Whether the argument accepts an infinite number of values
                      * @type {boolean}
                      */
                     this.infinite = Boolean(info.infinite);
             
                     /**
                      * Validator function for validating a value for the argument
                      * @type {?Function}
                      * @see {@link ArgumentType#validate}
                      */
                     this.validator = info.validate || null;
             
                     /**
                      * Parser function for parsing a value for the argument
                      * @type {?Function}
                      * @see {@link ArgumentType#parse}
                      */
                     this.parser = info.parse || null;
             
                     /**
                      * Function to check whether a raw value is considered empty
                      * @type {?Function}
                      * @see {@link ArgumentType#isEmpty}
                      */
                     this.emptyChecker = info.isEmpty || null;
             
                     /**
                      * How long to wait for input (in seconds)
                      * @type {number}
                      */
                     this.wait = typeof info.wait !== 'undefined' ? info.wait : 30;
             
                     /**
                      * The prepend
                      * @type {string}
                      */
                     this.prepend = typeof info.prepend === 'string' ? info.prepend : null;
             
                     /**
                      * Whether to DM the user or not
                      * @type {boolean}
                      */
                     this.dmOnly = typeof info.dmOnly !== 'undefined' ? info.dmOnly : false;
                 }
             
                 /**
                  * Result object from obtaining a single {@link Argument}'s value(s)
                  * @typedef {Object} ArgumentResult
                  * @property {?*|?Array<*>} value - Final value(s) for the argument
                  * @property {?string} cancelled - One of:
                  * - `user` (user cancelled)
                  * - `time` (wait time exceeded)
                  * - `promptLimit` (prompt limit exceeded)
                  * @property {Message[]} prompts - All messages that were sent to prompt the user
                  * @property {Message[]} answers - All of the user's messages that answered a prompt
                  */
             
                 /**
                  * Prompts the user and obtains the value for the argument
                  * @param {CommandMessage} msg - Message that triggered the command
                  * @param {string} [value] - Pre-provided value for the argument
                  * @param {number} [promptLimit=Infinity] - Maximum number of times to prompt for the argument
                  * @return {Promise<ArgumentResult>}
                  */
                 async obtain(msg, value, promptLimit = Infinity) {
                     let empty = this.isEmpty(value, msg);
                     if (empty && this.default !== null) {
                         return {
                             value: typeof this.default === 'function' ? await this.default(msg, this) : this.default,
                             cancelled: null,
                             prompts: [],
                             answers: []
                         };
                     }
                     if (this.infinite) return this.obtainInfinite(msg, value, promptLimit);
             
                     const wait = this.wait > 0 && this.wait !== Infinity ? this.wait * 1000 : undefined;
                     const prompts = [];
                     const answers = [];
                     let valid = !empty ? await this.validate(value, msg) : false;
             
                     while (!valid || typeof valid === 'string') {
                         /* eslint-disable no-await-in-loop */
                         if (prompts.length >= promptLimit) {
                             return {
                                 value: null,
                                 cancelled: 'promptLimit',
                                 prompts,
                                 answers
                             };
                         }
             
                         // Prompt the user for a new value
                         let embed = new Disocrd.MessageEmbed()
                         .setDescription(stripIndents`
                         ${stripIndents`${empty ? this.prompt : valid ? valid : `You provided an invalid ${this.label}. Please try again.`}`}
                         ${oneLine`${this.prepend ? this.prepend : `Respond with \`cancel\` to cancel the command.`}`}
                         `)
                         if (!valid) embed.setColor(colour.yellow);
                         else embed.setColor(colour.red)
                         prompts.push(this.dmOnly ? (await msg.direct(embed)) : (await msg.reply(embed)));
             
                         //${wait ? `The command will automatically be cancelled in ${this.wait} seconds.` : ''}
             
                         // Get the user's response
                         const responses = await (this.dmOnly ? (await msg.author.createDM()) : msg.channel).awaitMessages(msg2 => msg2.author.id === msg.author.id, {
                             max: 1,
                             time: wait
                         });
             
                         // Make sure they actually answered
                         if (responses && responses.size === 1) {
                             answers.push(responses.first());
                             value = answers[answers.length - 1].content;
                         } else {
                             return {
                                 value: null,
                                 cancelled: 'time',
                                 prompts,
                                 answers
                             };
                         }
             
                         // See if they want to cancel
                         if (value.toLowerCase() === 'cancel') {
                             return {
                                 value: null,
                                 cancelled: 'user',
                                 prompts,
                                 answers
                             };
                         }
             
                         empty = this.isEmpty(value, msg);
                         valid = await this.validate(value, msg);
                         /* eslint-enable no-await-in-loop */
                     }
             
                     return {
                         value: await this.parse(value, msg),
                         cancelled: null,
                         prompts,
                         answers
                     };
                 }
             
                 /**
                  * Prompts the user and obtains multiple values for the argument
                  * @param {CommandMessage} msg - Message that triggered the command
                  * @param {string[]} [values] - Pre-provided values for the argument
                  * @param {number} [promptLimit=Infinity] - Maximum number of times to prompt for the argument
                  * @return {Promise<ArgumentResult>}
                  * @private
                  */
                 async obtainInfinite(msg, values, promptLimit = Infinity) { // eslint-disable-line complexity
                     const wait = this.wait > 0 && this.wait !== Infinity ? this.wait * 1000 : undefined;
                     const results = [];
                     const prompts = [];
                     const answers = [];
                     let currentVal = 0;
             
                     while (true) { // eslint-disable-line no-constant-condition
                         /* eslint-disable no-await-in-loop */
                         let value = values && values[currentVal] ? values[currentVal] : null;
                         let valid = value ? await this.validate(value, msg) : false;
                         let attempts = 0;
             
                         while (!valid || typeof valid === 'string') {
                             attempts++;
                             if (attempts > promptLimit) {
                                 return {
                                     value: null,
                                     cancelled: 'promptLimit',
                                     prompts,
                                     answers
                                 };
                             }
             
                             // Prompt the user for a new value
                             if (value) {
                                 const escaped = escapeMarkdown(value).replace(/@/g, '@\u200b');
                                 prompts.push(await msg.reply(stripIndents`
                                     ${valid ? valid : oneLine`
                                         You provided an invalid ${this.label},
                                         "${escaped.length < 1850 ? escaped : '[too long to show]'}".
                                         Please try again.
                                     `}
                                     ${oneLine`
                                         Respond with \`cancel\` to cancel the command, or \`finish\` to finish entry up to this point.
                                         ${wait ? `The command will automatically be cancelled in ${this.wait} seconds.` : ''}
                                     `}
                                 `));
                             } else if (results.length === 0) {
                                 prompts.push(await msg.reply(stripIndents`
                                     ${this.prompt}
                                     ${oneLine`
                                         Respond with \`cancel\` to cancel the command, or \`finish\` to finish entry.
                                         ${wait ? `The command will automatically be cancelled in ${this.wait} seconds, unless you respond.` : ''}
                                     `}
                                 `));
                             }
             
                             // Get the user's response
                             const responses = await msg.channel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
                                 max: 1,
                                 time: wait
                             });
             
                             // Make sure they actually answered
                             if (responses && responses.size === 1) {
                                 answers.push(responses.first());
                                 value = answers[answers.length - 1].content;
                             } else {
                                 return {
                                     value: null,
                                     cancelled: 'time',
                                     prompts,
                                     answers
                                 };
                             }
             
                             // See if they want to finish or cancel
                             const lc = value.toLowerCase();
                             if (lc === 'finish') {
                                 return {
                                     value: results.length > 0 ? results : null,
                                     cancelled: results.length > 0 ? null : 'user',
                                     prompts,
                                     answers
                                 };
                             }
                             if (lc === 'cancel') {
                                 return {
                                     value: null,
                                     cancelled: 'user',
                                     prompts,
                                     answers
                                 };
                             }
             
                             valid = await this.validate(value, msg);
                         }
             
                         results.push(await this.parse(value, msg));
             
                         if (values) {
                             currentVal++;
                             if (currentVal === values.length) {
                                 return {
                                     value: results,
                                     cancelled: null,
                                     prompts,
                                     answers
                                 };
                             }
                         }
                         /* eslint-enable no-await-in-loop */
                     }
                 }
             
                 /**
                  * Checks if a value is valid for the argument
                  * @param {string} value - Value to check
                  * @param {CommandMessage} msg - Message that triggered the command
                  * @return {boolean|string|Promise<boolean|string>}
                  */
                 validate(value, msg) {
                     const valid = this.validator ? this.validator(value, msg, this) : this.type.validate(value, msg, this);
                     if (!valid || typeof valid === 'string') return this.error || valid;
                     if (valid instanceof Promise) return valid.then(vld => !vld || typeof vld === 'string' ? this.error || vld : vld);
                     return valid;
                 }
             
                 /**
                  * Parses a value string into a proper value for the argument
                  * @param {string} value - Value to parse
                  * @param {CommandMessage} msg - Message that triggered the command
                  * @return {*|Promise<*>}
                  */
                 parse(value, msg) {
                     if (this.parser) return this.parser(value, msg, this);
                     return this.type.parse(value, msg, this);
                 }
             
                 /**
                  * Checks whether a value for the argument is considered to be empty
                  * @param {string} value - Value to check for emptiness
                  * @param {CommandMessage} msg - Message that triggered the command
                  * @return {boolean}
                  */
                 isEmpty(value, msg) {
                     if (this.emptyChecker) return this.emptyChecker(value, msg, this);
                     if (this.type) return this.type.isEmpty(value, msg, this);
                     return !value;
                 }
             
                 /**
                  * Validates the constructor parameters
                  * @param {CommandoClient} client - Client to validate
                  * @param {ArgumentInfo} info - Info to validate
                  * @private
                  */
                 static validateInfo(client, info) {
                     if (!client) throw new Error('The argument client must be specified.');
                     if (typeof info !== 'object') throw new TypeError('Argument info must be an Object.');
                     if (typeof info.key !== 'string') throw new TypeError('Argument key must be a string.');
                     if (info.label && typeof info.label !== 'string') throw new TypeError('Argument label must be a string.');
                     if (typeof info.prompt !== 'string') throw new TypeError('Argument prompt must be a string.');
                     if (info.error && typeof info.error !== 'string') throw new TypeError('Argument error must be a string.');
                     if (info.type && typeof info.type !== 'string') throw new TypeError('Argument type must be a string.');
                     if (info.type && !info.type.includes('|') && !client.registry.types.has(info.type)) {
                         throw new RangeError(`Argument type "${info.type}" isn't registered.`);
                     }
                     if (!info.type && !info.validate) {
                         throw new Error('Argument must have either "type" or "validate" specified.');
                     }
                     if (info.validate && typeof info.validate !== 'function') {
                         throw new TypeError('Argument validate must be a function.');
                     }
                     if (info.parse && typeof info.parse !== 'function') {
                         throw new TypeError('Argument parse must be a function.');
                     }
                     if (!info.type && (!info.validate || !info.parse)) {
                         throw new Error('Argument must have both validate and parse since it doesn\'t have a type.');
                     }
                     if (typeof info.wait !== 'undefined' && (typeof info.wait !== 'number' || Number.isNaN(info.wait))) {
                         throw new TypeError('Argument wait must be a number.');
                     }
                 }
             
                 /**
                  * Gets the argument type to use from an ID
                  * @param {string} id - ID of the type to use
                  * @returns {?ArgumentType}
                  * @private
                  */
                 static determineType(client, id) {
                     if (!id) return null;
                     if (!id.includes('|')) return client.registry.types.get(id);
             
                     let type = client.registry.types.get(id);
                     if (type) return type;
                     type = new ArgumentUnionType(client, id);
                     client.registry.registerType(type);
                     return type;
                 }
             }
             
             
             
             
             /** Obtains, validates, and prompts for argument values */
             class ArgumentCollector {
                 /**
                  * @param {CommandoClient} client - Client the collector will use
                  * @param {ArgumentInfo[]} args - Arguments for the collector
                  * @param {number} [promptLimit=Infinity] - Maximum number of times to prompt for a single argument
                  */
                 constructor(client, args, promptLimit = Infinity) {
                     if(!client) throw new TypeError('Collector client must be specified.');
                     if(!args || !Array.isArray(args)) throw new TypeError('Collector args must be an Array.');
                     if(promptLimit === null) promptLimit = Infinity;
             
                     /**
                      * Client this collector is for
                      * @name ArgumentCollector#client
                      * @type {CommandoClient}
                      * @readonly
                      */
                     Object.defineProperty(this, 'client', { value: client });
             
                     /**
                      * Arguments the collector handles
                      * @type {Argument[]}
                      */
                     this.args = new Array(args.length);
             
                     let hasInfinite = false;
                     let hasOptional = false;
                     for(let i = 0; i < args.length; i++) {
                         if(hasInfinite) throw new Error('No other argument may come after an infinite argument.');
                         if(args[i].default !== null) hasOptional = true;
                         else if(hasOptional) throw new Error('Required arguments may not come after optional arguments.');
                         this.args[i] = new Argument(this.client, args[i]);
                         if(this.args[i].infinite) hasInfinite = true;
                     }
             
                     /**
                      * Maximum number of times to prompt for a single argument
                      * @type {number}
                      */
                     this.promptLimit = promptLimit;
                 }
             
                 /**
                  * Result object from obtaining argument values from an {@link ArgumentCollector}
                  * @typedef {Object} ArgumentCollectorResult
                  * @property {?Object} values - Final values for the arguments, mapped by their keys
                  * @property {?string} cancelled - One of:
                  * - `user` (user cancelled)
                  * - `time` (wait time exceeded)
                  * - `promptLimit` (prompt limit exceeded)
                  * @property {Message[]} prompts - All messages that were sent to prompt the user
                  * @property {Message[]} answers - All of the user's messages that answered a prompt
                  */
             
                 /**
                  * Obtains values for the arguments, prompting if necessary.
                  * @param {CommandMessage} msg - Message that the collector is being triggered by
                  * @param {Array<*>} [provided=[]] - Values that are already available
                  * @param {number} [promptLimit=this.promptLimit] - Maximum number of times to prompt for a single argument
                  * @return {Promise<ArgumentCollectorResult>}
                  */
                 async obtain(msg, provided = [], promptLimit = this.promptLimit) {
                     this.client.dispatcher._awaiting.add(msg.message.author.id + msg.message.channel.id);
                     const values = {};
                     const results = [];
             
                     try {
                         for(let i = 0; i < this.args.length; i++) {
                             /* eslint-disable no-await-in-loop */
                             const arg = this.args[i];
                             const result = await arg.obtain(msg, arg.infinite ? provided.slice(i) : provided[i], promptLimit);
                             results.push(result);
             
                             if(result.cancelled) {
                                 this.client.dispatcher._awaiting.delete(msg.message.author.id + msg.message.channel.id);
                                 return {
                                     values: null,
                                     cancelled: result.cancelled,
                                     prompts: [].concat(...results.map(res => res.prompts)),
                                     answers: [].concat(...results.map(res => res.answers))
                                 };
                             }
             
                             if (result) values[arg.key] = result.value;
                             /* eslint-enable no-await-in-loop */
                         }
                     } catch(err) {
                         this.client.dispatcher._awaiting.delete(msg.message.author.id + msg.message.channel.id);
                         throw err;
                     }
             
                     this.client.dispatcher._awaiting.delete(msg.message.author.id + msg.message.channel.id);
                     return {
                         values,
                         cancelled: null,
                         prompts: [].concat(...results.map(res => res.prompts)),
                         answers: [].concat(...results.map(res => res.answers))
                     };
                 }
             }
             
             
             /** A command container */
             class Command {
                 /**
                  * @typedef {Object} CommandInfo
                  * @property {string} name - The name of the command (must be lowercase)
                  * @property {string[]} [aliases] - Alternative names for the command (all must be lowercase)
                  * @property {boolean} [autoAliases=true] - Whether automatic aliases should be added
                  * @property {string} description - A short description of the command
                  * @property {string} [format] - The command usage format string - will be automatically generated if not specified,
                  * and `args` is specified
                  * @property {string[]} [examples] - Usage examples of the command
                  * @property {boolean} [guildOnly=false] - Whether or not the command should only function in a guild channel
                  * @property {boolean} [serverOnly=false] - Whether or not the command should only function in TFR
                  */
             
                 /**
                  * @param {CommandInfo} info - The command information
                  */
                 constructor(info) {
                     this.constructor.validateInfo(info);
             
                     /**
                      * Name of this command
                      * @type {string}
                      */
                     this.name = info.name;
             
                     /**
                      * Aliases for this command
                      * @type {string[]}
                      */
                     this.aliases = info.aliases || [];
                     if (typeof info.autoAliases === 'undefined' || info.autoAliases) {
                         if (this.name.includes('-')) this.aliases.push(this.name.replace(/-/g, ''));
                         for (const alias of this.aliases) {
                             if (alias.includes('-')) this.aliases.push(alias.replace(/-/g, ''));
                         }
                     }
             
                     /**
                      * Short description of the command
                      * @type {string}
                      */
                     this.description = info.description;
             
                     /**
                      * Usage format string of the command
                      * @type {string}
                      */
                     this.format = info.format || null;
                     
                     /**
                      * Long description of the command
                      * @type {?string}
                      */
                     this.details = info.details || null;
             
                     /**
                      * Example usage strings
                      * @type {?string[]}
                      */
                     this.examples = info.examples || null;
             
                     /**
                      * Whether they require at least one of these roles to run the command
                      * @type {?string[]}
                      */
                     this.hasOne = info.hasOne || null;
             
                     /**
                      * Whether the command should only function in a guild channel
                      * @type {boolean}
                      */
                     this.guildOnly = Boolean(info.guildOnly);
             
                     /**
                      * Whether the command should only function in TFR
                      * @type {boolean}
                      */
                     this.serverOnly = Boolean(info.serverOnly);
                     
                     /**
                      * Whether or not the command should be shown
                      * @type {boolean}
                      */
                     this.hidden = Boolean(info.hidden);
                     
                     /**
                      * Whether the default command handling is enabled for the command
                      * @type {boolean}
                      */
                     this.defaultHandling = 'defaultHandling' in info ? info.defaultHandling : true;
                     
                     /**
                      * The argument collector for the command
                      * @type {?ArgumentCollector}
                      */
                     this.argsCollector = info.args ? new ArgumentCollector(client, info.args, info.argsPromptLimit) : null;
                     if (this.argsCollector && typeof info.format === 'undefined') {
                         this.format = this.argsCollector.args.reduce((prev, arg) => {
                             const wrapL = arg.default !== null ? '[' : '<';
                             const wrapR = arg.default !== null ? ']' : '>';
                             return `${prev}${prev ? ' ' : ''}${wrapL}${arg.label}${arg.infinite ? '...' : ''}${wrapR}`;
                         }, '');
                     }
                     
                     /**
                      * How the arguments are split when passed to the command's run method
                      * @type {string}
                      */
                     this.argsType = info.argsType || 'single';
             
                     /**
                      * Maximum number of arguments that will be split
                      * @type {number}
                      */
                     this.argsCount = info.argsCount || 0;
             
                     /**
                      * Whether single quotes are allowed to encapsulate an argument
                      * @type {boolean}
                      */
                     this.argsSingleQuotes = 'argsSingleQuotes' in info ? info.argsSingleQuotes : true;
                     
                     /**
                      * Regular expression triggers
                      * @type {RegExp[]}
                      */
                     this.patterns = info.patterns || null;
                 }
                 
                 /**
                  * Checks if the user has permission to use the command
                  * @param {CommandMessage} message - The triggering command message
                  * @return {boolean|string} Whether the user has permission, or an error message to respond with if they don't
                  */
                 hasPermission(message) {
                     if (this.hasOne && message.member) {
                         var has = false;
                         for (var i in this.hasOne) {
                             if (message.member.roles.includes(this.hasOne[i])) {
                                 has = true;
                                 break;
                             };
                         };
                         if (!has) {
                             return `You do not have the correct permissions to use this command.`;
                         }
                     }
                     return true;
                 }
             
                 /**
                  * Runs the command
                  * @param {CommandMessage} message - The message the command is being run for
                  * @param {Object|string|string[]} args - The arguments for the command, or the matches from a pattern.
                  * If args is specified on the command, thise will be the argument values object. If argsType is single, then only
                  * one string will be passed. If multiple, an array of strings will be passed. When fromPattern is true, this is the
                  * matches array from the pattern match
                  * (see [RegExp#exec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)).
                  * @return {Promise<?Message|?Array<Message>>}
                  * @abstract
                  */
                 async run(message, args) { // eslint-disable-line no-unused-vars, require-await
                     throw new Error(`${this.constructor.name} doesn't have a run() method.`);
                 }
                 
                 /**
                  * Checks if the command is usable for a message
                  * @param {?Message} message - The message
                  * @return {boolean}
                  */
                 isUsable(message = null) {
                     if (!message) return this._globalEnabled;
                     if (this.guildOnly && message && !message.guild) return false;
                     if (this.serverOnly && message && (!message.guild || (message.guild && !(message.guild.id === serverId)))) return false;
                     let hasPermission = this.hasPermission(message);
                     if (typeof hasPermission === 'string') hasPermission = false;
                     return hasPermission;
                 }
             
                 /**
                  * Validates the constructor parameters
                  * @param {CommandoClient} client - Client to validate
                  * @param {CommandInfo} info - Info to validate
                  * @private
                  */
                 static validateInfo(info) { // eslint-disable-line complexity
                     if (typeof info !== 'object') throw new TypeError('Command info must be an Object.');
                     if (typeof info.name !== 'string') throw new TypeError('Command name must be a string.');
                     if (info.name !== info.name.toLowerCase()) throw new Error('Command name must be lowercase.');
                     if (info.aliases && (!Array.isArray(info.aliases) || info.aliases.some(ali => typeof ali !== 'string'))) {
                         throw new TypeError('Command aliases must be an Array of strings.');
                     }
                     if (info.aliases && info.aliases.some(ali => ali !== ali.toLowerCase())) {
                         throw new Error('Command aliases must be lowercase.');
                     }
                     if ('description' in info && typeof info.description !== 'string') throw new TypeError('Command description must be a string.');
                     if ('format' in info && typeof info.format !== 'string') throw new TypeError('Command format must be a string.');
                     if (info.examples && (!Array.isArray(info.examples) || info.examples.some(ex => typeof ex !== 'string'))) {
                         throw new TypeError('Command examples must be an Array of strings.');
                     }
                 }
             
                 /**
                  * Creates a usage string for the command
                  * @param {string} [argString] - A string of arguments for the command
                  * @param {string} [prefix=prefix] - Prefix to use for the prefixed command format
                  * @return {string}
                  */
                 usage(argString, prefix = prefix) {
                     return this.constructor.usage(`${this.name}${argString ? ` ${argString}` : ''}`, prefix);
                 }
                 
                 /**
                  * Creates a usage string for a command
                  * @param {string} command - A command + arg string
                  * @param {string} [prefix] - Prefix to use for the prefixed command format
                  * @return {string}
                  */
                 static usage(command, prefix = null) {
                     const nbcmd = command.replace(/ /g, '\xa0');
                     if (!prefix) return `\`${nbcmd}\``;
             
                     let prefixPart;
                     if (prefix) {
                         if (prefix.length > 1 && !prefix.endsWith(' ')) prefix += '';
                         prefix = prefix.replace(/ /g, '\xa0');
                         prefixPart = `\`${prefix}${nbcmd}\``;
                     }
                     
                     return `${prefixPart || ''}`;
                 }
             }
             
             /** A container for a message that triggers a command, that command, and methods to respond */
             class CommandMessage {
                 /**
                  * @param {Message} message - Message that triggers the command
                  * @param {Command} [command] - Command the message triggers
                  * @param {string} [argString] - Argument string for the command
                  * @param {?Array<string>} [patternMatches] - Command pattern matches (if from a pattern trigger)
                  */
                 constructor(message, command = null, argString = null, patternMatches = null) {
                     /**
                      * Message that triggers the command
                      * @type {Message}
                      */
                     this.message = message;
             
                     /**
                      * Command that the message triggers, if any
                      * @type {?Command}
                      */
                     this.command = command;
             
                     /**
                      * Argument string for the command
                      * @type {?string}
                      */
                     this.argString = argString;
             
                     /**
                      * Pattern matches (if from a pattern trigger)
                      * @type {?string[]}
                      */
                     this.patternMatches = patternMatches;
             
                     /**
                      * Response messages sent, mapped by channel ID (set by the dispatcher after running the command)
                      * @type {?Object}
                      */
                     this.responses = null;
             
                     /**
                      * The index of the current response that will be edited, mapped by channel ID
                      * @type {?Object}
                      */
                     this.responsePositions = null;
                 }
             
                 /**
                  * Creates a usage string for the message's command
                  * @param {string} [argString] - A string of arguments for the command
                  * @param {string} [prefix=prefix] - Prefix to use for the
                  * prefixed command format
                  * @return {string}
                  */
                 usage(argString, prefix = prefix) {
                     return this.command.usage(argString, prefix);
                 }
             
                 /**
                  * Creates a usage string for any command
                  * @param {string} [command] - A command + arg string
                  * @param {string} [prefix=prefix] - Prefix to use for the
                  * prefixed command format
                  * @return {string}
                  */
                 anyUsage(command, prefix=prefix) {
                     return Command.usage(command, prefix);
                 }
             
                 /**
                  * Parses the argString into usable arguments, based on the argsType and argsCount of the command
                  * @return {string|string[]}
                  * @see {@link Command#run}
                  */
                 parseArgs() {
                     switch (this.command.argsType) {
                         case 'single':
                             return this.argString.trim().replace(
                                 this.command.argsSingleQuotes ? /^("|')([^]*)\1$/g : /^(")([^]*)"$/g, '$2'
                             );
                         case 'multiple':
                             return this.constructor.parseArgs(this.argString, this.command.argsCount, this.command.argsSingleQuotes);
                         default:
                             throw new RangeError(`Unknown argsType "${this.argsType}".`);
                     }
                 }
                 
                 static async clearResponses() {
                     return null;
                     // return await ZLibrary.DiscordModules.MessageActions.fetchMessages({channelId: BDFDB.LibraryModules.LastChannelStore.getChannelId()});
                 }
             
                 /**
                  * Runs the command
                  * @return {Promise<?Message|?Array<Message>>}
                  */
                 async run() { // eslint-disable-line complexity
                     // Obtain the member if we don't have it (ugly-ass if statement ahead)
                     if (this.message.channel.type === 'text' && !this.message.guild.members.cache.has(this.message.author.id) &&
                         !this.message.webhookID) {
                         this.message.member = await this.message.guild.members.fetch(this.message.author);
                     }
             
                     // Make sure the command is usable
                     if (this.command.guildOnly && !this.message.guild) {
                         return this.reply(`The \`${this.command.name}\` command must be used in a server channel.`);
                     }
             
                     if (this.command.serverOnly && !(this.message.guild.id === serverId)) {
                         return this.reply(`The \`${this.command.name}\` command can only be used in the server.`);
                     }
             
                     if (this.command.hasOne && this.message.member) {
                         var has = false;
                         for (var i in this.command.hasOne) {
                             if (this.message.member.roles.includes(this.command.hasOne[i])) {
                                 has = true;
                                 break;
                             };
                         };
                         if (!has) {
                             return this.reply(`You do not have the required roles to use the \`${this.command.name}\` command.`);
                         }
                     }
             
                     // Figure out the command arguments
                     let args = this.patternMatches;
                     let result = null;
                     if (!args && this.command.argsCollector) {
                         const collArgs = this.command.argsCollector.args;
                         const count = collArgs[collArgs.length - 1].infinite ? Infinity : collArgs.length;
                         const provided = this.constructor.parseArgs(this.argString.trim(), count, this.command.argsSingleQuotes);
             
                         const result2 = await this.command.argsCollector.obtain(this, provided);
                         if (result2.cancelled) {
                             if (result2.prompts.length === 0) {
                                 const err = new CommandFormatError(this);
                                 return this.reply(err.message);
                             }
                             return this.reply('Cancelled command.');
                         }
                         args = result2.values;
                         result = result2;
                     }
                     if (!args) args = this.parseArgs();
                     const fromPattern = Boolean(this.patternMatches);
             
                     // Run the command
                     try {
                         await this.constructor.clearResponses();
                         const promise = this.command.run(this, args, { fromPattern, result });
                         const retVal = await promise;
                         if (!(retVal instanceof VirtualMessage || retVal instanceof Message || retVal instanceof Array || retVal === null || retVal === undefined)) {
                             throw new TypeError(`Command ${this.command.name}'s run() resolved with an unknown type\n(${retVal !== null ? retVal && retVal.constructor ? retVal.constructor.name : typeof retVal : null}).\nCommand run methods must return a Promise that resolve with a Message, Array of Messages, or null/undefined.`);
                         }
                         return retVal;
                     } catch (err) {
                         if (err instanceof FriendlyError) {
                             return this.say(err.message);
                         } else {
                             this.say(`Whoops, I have encountered an error while running that command.\nCheck console for more information.\n\`\`\`${err.name || 'Unknown Error'}: ${err.message || 'No Message'}\`\`\``)
                             console.error(config.info.name, err)
                             // BdApi.alert("ATFRModerator Error", `${err.name || 'Unknown Error'}: ${err.message || 'No message'}`);
                         }
                     }
                 }
             
                 /**
                  * Responds to the command message
                  * @param {Object} [options] - Options for the response
                  * @return {Message|Message[]}
                  * @private
                  */
                 respond({ type = 'reply', content, options, lang, fromEdit = false }) {
                     if (type === 'reply' && this.message.channel.type === 'dm') type = 'plain';
             
                     content = Util.resolveString(content);
             
                     switch (type) {
                         case 'plain':
                             let msg = new VirtualMessage(this.message.channel, content, options);
                             msg.send();
                             let q = document.querySelector("#chat-messages-" + msg.message.id)
                             if (q && amounts.live !== 0 && (!options || !options.important)) setTimeout(() => {
                                 q.style.display = 'none';
                                 // delete ZLibrary.DiscordModules.MessageActions.deleteMessage(msg.channel_id, msg.message.id);
                                 // q.remove(); this would crash discord
                             }, amounts.live * 1000);
                             return msg;
                         case 'reply':
                             if (content === undefined || content === '') {
                                 return new VirtualMessage(this.message.channel, `<@!${this.message.author.id}>`, options).send();
                             } else {
                                 return new VirtualMessage(this.message.channel, `<@!${this.message.author.id}>, ` + content, options).send();
                             }
                         case 'direct':
                             return; // idk how to dm them via the system channel so i'll leave this out
                         case 'code':
                             return new VirtualMessage(this.message.channel, content, options).send();
                         default:
                             throw new RangeError(`Unknown response type "${type}".`);
                     }
                 }
             
                 /**
                  * Edits a response to the command message
                  * @param {Message|Message[]} response - The response message(s) to edit
                  * @param {Object} [options] - Options for the response
                  * @return {Promise<Message|Message[]>}
                  * @private
                  */
                 editResponse(response, { type, content, options }) {
                     if (!response) return this.respond({ type, content, options, fromEdit: true });
                     if (options && options.split) content = discord.splitMessage(content, options.split);
             
                     let prepend = '';
                     if (type === 'reply') prepend = `${this.message.author}, `;
             
                     if (content instanceof Array) {
                         const promises = [];
                         if (response instanceof Array) {
                             for (let i = 0; i < content.length; i++) {
                                 if (response.length > i) promises.push(response[i].edit(`${prepend}${content[i]}`, options));
                                 else promises.push(response[0].channel.send(`${prepend}${content[i]}`));
                             }
                         } else {
                             promises.push(response.edit(`${prepend}${content[0]}`, options));
                             for (let i = 1; i < content.length; i++) {
                                 promises.push(response.channel.send(`${prepend}${content[i]}`));
                             }
                         }
                         return Promise.all(promises);
                     } else {
                         if (response instanceof Array) { // eslint-disable-line no-lonely-if
                             for (let i = response.length - 1; i > 0; i--) response[i].delete();
                             return response[0].edit(`${prepend}${content}`, options);
                         } else {
                             return response.edit(`${prepend}${content}`, options);
                         }
                     }
                 }
             
                 /**
                  * Edits the current response
                  * @param {string} id - The ID of the channel the response is in ("DM" for direct messages)
                  * @param {Object} [options] - Options for the response
                  * @return {Promise<Message|Message[]>}
                  * @private
                  */
                 editCurrentResponse(id, options) {
                     if (typeof this.responses[id] === 'undefined') this.responses[id] = [];
                     if (typeof this.responsePositions[id] === 'undefined') this.responsePositions[id] = -1;
                     this.responsePositions[id]++;
                     return this.editResponse(this.responses[id][this.responsePositions[id]], options);
                 }
 
                 /**
                  * Responds with a plain message
                  * @param {StringResolvable} [channel=this.message.channel] - Content for the message
                  * @param {StringResolvable} content - Content for the message
                  * @param {MessageOptions} [options] - Options for the message
                  * @return {Promise<Message|Message[]>}
                  */
                 force(channel = this.message.channel, content, options) {
                     return new Message(channel, content, options);
                 }
             
                 /**
                  * Responds with a plain message
                  * @param {StringResolvable} content - Content for the message
                  * @param {MessageOptions} [options] - Options for the message
                  * @return {Promise<Message|Message[]>}
                  */
                 say(content, options) {
                     if (!options && typeof content === 'object' && !(content instanceof Array)) {
                         options = content;
                         content = '';
                     }
                     return this.respond({ type: 'plain', content, options });
                 }
             
                 /**
                  * Responds with a reply message
                  * @param {StringResolvable} content - Content for the message
                  * @param {MessageOptions} [options] - Options for the message
                  * @return {Promise<Message|Message[]>}
                  */
                 reply(content, options) {
                     if (!options && typeof content === 'object' && !(content instanceof Array)) {
                         options = content;
                         content = '';
                     }
                     return this.respond({ type: 'reply', content, options });
                 }
             
                 /**
                  * Responds with a direct message
                  * @param {StringResolvable} content - Content for the message
                  * @param {MessageOptions} [options] - Options for the message
                  * @return {Promise<Message|Message[]>}
                  */
                 direct(content, options) {
                     if (!options && typeof content === 'object' && !(content instanceof Array)) {
                         options = content;
                         content = '';
                     }
                     return this.respond({ type: 'direct', content, options });
                 }
             
                 /**
                  * Responds with a code message
                  * @param {string} lang - Language for the code block
                  * @param {StringResolvable} content - Content for the message
                  * @param {MessageOptions} [options] - Options for the message
                  * @return {Promise<Message|Message[]>}
                  */
                 code(lang, content, options) {
                     if (!options && typeof content === 'object' && !(content instanceof Array)) {
                         options = content;
                         content = '';
                     }
                     if (typeof options !== 'object') options = {};
                     options.code = lang;
                     return this.respond({ type: 'code', content, options });
                 }
             
                 /**
                  * Responds with an embed
                  * @param {RichEmbed|Object} embed - Embed to send
                  * @param {StringResolvable} [content] - Content for the message
                  * @param {MessageOptions} [options] - Options for the message
                  * @return {Promise<Message|Message[]>}
                  */
                 embed(embed, content = '', options) {
                     if (typeof options !== 'object') options = {};
                     options.embed = embed;
                     return this.respond({ type: 'plain', content, options });
                 }
             
                 /**
                  * Responds with a mention + embed
                  * @param {RichEmbed|Object} embed - Embed to send
                  * @param {StringResolvable} [content] - Content for the message
                  * @param {MessageOptions} [options] - Options for the message
                  * @return {Promise<Message|Message[]>}
                  */
                 replyEmbed(embed, content = '', options) {
                     if (typeof options !== 'object') options = {};
                     options.embed = embed;
                     return this.respond({ type: 'reply', content, options });
                 }
             
                 /**
                  * Finalizes the command message by setting the responses and deleting any remaining prior ones
                  * @param {?Array<Message|Message[]>} responses - Responses to the message
                  * @private
                  */
                 finalize(responses) {
                     if (this.responses) this.deleteRemainingResponses();
                     this.responses = {};
                     this.responsePositions = {};
             
                     if (responses instanceof Array) {
                         for (const response of responses) {
                             const channel = (response instanceof Array ? response[0] : response).channel;
                             const id = channelIDOrDM(channel);
                             if (!this.responses[id]) {
                                 this.responses[id] = [];
                                 this.responsePositions[id] = -1;
                             }
                             this.responses[id].push(response);
                         }
                     } else if (responses && responses.channel) {
                         const id = channelIDOrDM(responses.channel);
                         this.responses[id] = [responses];
                         this.responsePositions[id] = -1;
                     }
                 }
             
                 /**
                  * Deletes any prior responses that haven't been updated
                  * @private
                  */
                 deleteRemainingResponses() {
                     for (const id of Object.keys(this.responses)) {
                         const responses = this.responses[id];
                         for (let i = this.responsePositions[id] + 1; i < responses.length; i++) {
                             const response = responses[i];
                             if (response instanceof Array) {
                                 for (const resp of response) resp.delete();
                             } else {
                                 response.delete();
                             }
                         }
                     }
                 }
             
                 /**
                  * Parses an argument string into an array of arguments
                  * @param {string} argString - The argument string to parse
                  * @param {number} [argCount] - The number of arguments to extract from the string
                  * @param {boolean} [allowSingleQuote=true] - Whether or not single quotes should be allowed to wrap arguments,
                  * in addition to double quotes
                  * @return {string[]} The array of arguments
                  */
                 static parseArgs(argString, argCount, allowSingleQuote = true) {
                     const re = allowSingleQuote ? /\s*(?:("|')([^]*?)\1|(\S+))\s*/g : /\s*(?:(")([^]*?)"|(\S+))\s*/g;
                     const result = [];
                     let match = [];
                     // Large enough to get all items
                     argCount = argCount || argString.length;
                     // Get match and push the capture group that is not null to the result
                     while (--argCount && (match = re.exec(argString))) result.push(match[2] || match[3]);
                     // If text remains, push it to the array as-is (except for wrapping quotes, which are removed)
                     if (match && re.lastIndex < argString.length) {
                         const re2 = allowSingleQuote ? /^("|')([^]*)\1$/g : /^(")([^]*)"$/g;
                         result.push(argString.substr(re.lastIndex).replace(re2, '$2'));
                     }
                     return result;
                 }
             
             
                 /* -------------------------------------------------------------------------------------------- *\
                 |*                                          SHORTCUTS                                           *|
                 |*                          Rest not, and beware, for here be dragons.                          *|
                 |* Below these lines lie the fabled message method/getter shortcuts for ye olde lazy developer. *|
                 \* -------------------------------------------------------------------------------------------- */
             
                 /**
                  * Shortcut to `this.message.id`
                  * @type {string}
                  * @see {@link Message#id}
                  * @readonly
                  */
                 get id() {
                     return this.message.id;
                 }
             
                 /**
                  * Shortcut to `this.message.content`
                  * @type {string}
                  * @see {@link Message#content}
                  * @readonly
                  */
                 get content() {
                     return this.message.content;
                 }
             
                 /**
                  * Shortcut to `this.message.author`
                  * @type {User}
                  * @see {@link Message#author}
                  * @readonly
                  */
                 get author() {
                     return this.message.author;
                 }
             
                 /**
                  * Shortcut to `this.message.channel`
                  * @type {TextChannel|DMChannel|GroupDMChannel}
                  * @see {@link Message#channel}
                  * @readonly
                  */
                 get channel() {
                     return this.message.channel;
                 }
             
                 /**
                  * Shortcut to `this.message.guild`
                  * @type {?Guild}
                  * @see {@link Message#guild}
                  * @readonly
                  */
                 get guild() {
                     return this.message.guild;
                 }
             
                 /**
                  * Shortcut to `this.message.member`
                  * @type {?GuildMember}
                  * @see {@link Message#member}
                  * @readonly
                  */
                 get member() {
                     return this.message.member;
                 }
             
                 /**
                  * Shortcut to `this.message.pinned`
                  * @type {boolean}
                  * @see {@link Message#pinned}
                  * @readonly
                  */
                 get pinned() {
                     return this.message.pinned;
                 }
             
                 /**
                  * Shortcut to `this.message.tts`
                  * @type {boolean}
                  * @see {@link Message#tts}
                  * @readonly
                  */
                 get tts() {
                     return this.message.tts;
                 }
             
                 /**
                  * Shortcut to `this.message.nonce`
                  * @type {string}
                  * @see {@link Message#nonce}
                  * @readonly
                  */
                 get nonce() {
                     return this.message.nonce;
                 }
             
                 /**
                  * Shortcut to `this.message.system`
                  * @type {boolean}
                  * @see {@link Message#system}
                  * @readonly
                  */
                 get system() {
                     return this.message.system;
                 }
             
                 /**
                  * Shortcut to `this.message.embeds`
                  * @type {MessageEmbed[]}
                  * @see {@link Message#embeds}
                  * @readonly
                  */
                 get embeds() {
                     return this.message.embeds;
                 }
             
                 /**
                  * Shortcut to `this.message.attachments`
                  * @type {Collection<string, MessageAttachment>}
                  * @see {@link Message#attachments}
                  * @readonly
                  */
                 get attachments() {
                     return this.message.attachments;
                 }
             
                 /**
                  * Shortcut to `this.message.reactions`
                  * @type {Collection<string, MessageReaction>}
                  * @see {@link Message#reactions}
                  * @readonly
                  */
                 get reactions() {
                     return this.message.reactions;
                 }
             
                 /**
                  * Shortcut to `this.message.createdTimestamp`
                  * @type {number}
                  * @see {@link Message#createdTimestamp}
                  * @readonly
                  */
                 get createdTimestamp() {
                     return this.message.createdTimestamp;
                 }
             
                 /**
                  * Shortcut to `this.message.createdAt`
                  * @type {Date}
                  * @see {@link Message#createdAt}
                  * @readonly
                  */
                 get createdAt() {
                     return this.message.createdAt;
                 }
             
                 /**
                  * Shortcut to `this.message.editedTimestamp`
                  * @type {number}
                  * @see {@link Message#editedTimestamp}
                  * @readonly
                  */
                 get editedTimestamp() {
                     return this.message.editedTimestamp;
                 }
             
                 /**
                  * Shortcut to `this.message.editedAt`
                  * @type {Date}
                  * @see {@link Message#editedAt}
                  * @readonly
                  */
                 get editedAt() {
                     return this.message.editedAt;
                 }
             
                 /**
                  * Shortcut to `this.message.mentions`
                  * @type {Object}
                  * @see {@link Message#mentions}
                  * @readonly
                  */
                 get mentions() {
                     return this.message.mentions;
                 }
             
                 /**
                  * Shortcut to `this.message.webhookID`
                  * @type {?string}
                  * @see {@link Message#webhookID}
                  * @readonly
                  */
                 get webhookID() {
                     return this.message.webhookID;
                 }
             
                 /**
                  * Shortcut to `this.message.cleanContent`
                  * @type {string}
                  * @see {@link Message#cleanContent}
                  * @readonly
                  */
                 get cleanContent() {
                     return this.message.cleanContent;
                 }
             
                 /**
                  * Shortcut to `this.message.edits`
                  * @type {Message[]}
                  * @see {@link Message#edits}
                  * @readonly
                  */
                 get edits() {
                     return this.message.edits;
                 }
             
                 /**
                  * Shortcut to `this.message.editable`
                  * @type {boolean}
                  * @see {@link Message#editable}
                  * @readonly
                  */
                 get editable() {
                     return this.message.editable;
                 }
             
                 /**
                  * Shortcut to `this.message.deletable`
                  * @type {boolean}
                  * @see {@link Message#deletable}
                  * @readonly
                  */
                 get deletable() {
                     return this.message.deletable;
                 }
             
                 /**
                  * Shortcut to `this.message.pinnable`
                  * @type {boolean}
                  * @see {@link Message#pinnable}
                  * @readonly
                  */
                 get pinnable() {
                     return this.message.pinnable;
                 }
             
                 /**
                  * Shortcut to `this.message.mentions.has(data)`
                  * @param {GuildChannel|User|Role|string} data - A guild channel, user, or a role, or the ID of any of these
                  * @return {boolean}
                  * @see {@link Message#isMentioned}
                  * @readonly
                  */
                 isMentioned(data) {
                     return this.message.mentions.has(data);
                 }
             
                 /**
                  * Shortcut to `this.message.mentions.has(data)`
                  * @param {GuildMember|User} member - Member/user to check for a mention of
                  * @return {boolean}
                  * @see {@link Message#isMemberMentioned}
                  * @readonly
                  */
                 isMemberMentioned(member) {
                     return this.message.mentions.has(member);
                 }
             
                 /**
                  * Shortcut to `this.message.edit(content)`
                  * @param {StringResolvable} content - New content for the message
                  * @param {MessageEditOptions} options - The options to provide
                  * @returns {Promise<Message>}
                  * @see {@link Message#edit}
                  * @readonly
                  */
                 edit(content, options) {
                     return this.message.edit(content, options);
                 }
             
                 /**
                  * Shortcut to `this.message.editCode(content)`
                  * @param {string} lang - Language for the code block
                  * @param {StringResolvable} content - New content for the message
                  * @returns {Promise<Message>}
                  * @see {@link Message#editCode}
                  * @readonly
                  */
                 editCode(lang, content) {
                     return this.message.editCode(lang, content);
                 }
             
                 /**
                  * Shortcut to `this.message.react()`
                  * @param {string|Emoji|ReactionEmoji} emoji - Emoji to react with
                  * @returns {Promise<MessageReaction>}
                  * @see {@link Message#react}
                  * @readonly
                  */
                 react(emoji) {
                     return this.message.react(emoji);
                 }
             
                 /**
                  * Shortcut to `this.message.clearReactions()`
                  * @returns {Promise<Message>}
                  * @see {@link Message#clearReactions}
                  * @readonly
                  */
                 clearReactions() {
                     return this.message.clearReactions();
                 }
             
                 /**
                  * Shortcut to `this.message.pin()`
                  * @returns {Promise<Message>}
                  * @see {@link Message#pin}
                  * @readonly
                  */
                 pin() {
                     return this.message.pin();
                 }
             
                 /**
                  * Shortcut to `this.message.unpin()`
                  * @returns {Promise<Message>}
                  * @see {@link Message#unpin}
                  * @readonly
                  */
                 unpin() {
                     return this.message.unpin();
                 }
             
                 /**
                  * Shortcut to `this.message.delete()`
                  * @param {number} [timeout=0] - How long to wait to delete the message in milliseconds
                  * @returns {Promise<Message>}
                  * @see {@link Message#delete}
                  * @readonly
                  */
                 delete(timeout) {
                     return this.message.delete(timeout);
                 }
             }
             
             const registry = {types:{},commands:{}};
             let _args = [
                 class BooleanArgumentType extends ArgumentType {
                     constructor() {
                         super('boolean');
                         this.truthy = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']);
                         this.falsy = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']);
                     }
             
                     validate(value) {
                         const lc = value.toLowerCase();
                         return this.truthy.has(lc) || this.falsy.has(lc);
                     }
             
                     parse(value) {
                         const lc = value.toLowerCase();
                         if(this.truthy.has(lc)) return true;
                         if(this.falsy.has(lc)) return false;
                         throw new RangeError('Unknown boolean value.');
                     }
                 },
                 class CommandArgumentType extends ArgumentType {
                     constructor() {
                         super('command');
                     }
                 
                     validate(value) {
                         const commands = [];
                         for (var i in registry.commands) {
                             let cmd = registry.commands[i];
                             if (cmd.name.includes(value)) commands.push(cmd);
                         }
                         if(commands.length === 1) return true;
                         if(commands.length === 0) return false;
                         return commands.length <= 15 ?
                             `${disambiguation(commands.map(cmd => escapeMarkdown(cmd.name)), 'commands', null)}\n` :
                             'Multiple commands found. Please be more specific.';
                     }
                 
                     parse(value) {
                         return this.client.registry.findCommands(value)[0];
                     }
                 }
             ]
             let _commands = [
                 class BanCommand extends Command {
                     constructor() {
                         super({
                             name: 'ban',
                             format: '<user> [duration] [reason|autoreason]',
                             examples: ['ban @Griefs#9476 7d 6'],
                             hasOne: [permRoles['E'],
                                      permRoles['F'],
                                      permRoles['*']],
                             details: `Here's the list of autoreasons:\n${autosanctionMessages.map((v, i) => `${i + 1}: ${v}`).join('\n\n')}`,
                         });
                     }
             
                     run(msg, args) {
                         let split = args.split(' ');
                         var user = split[0];
                         var duration;
                         var reason;
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say("A user must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         let matchDuration = new RegExp(/(\d{1,4}[hdmy])/i).exec(args);
                         if (matchDuration && args.slice(0, matchDuration[0].length) === matchDuration[0]) {
                             args = args.replace(matchDuration[0], '').trim();
                             duration = matchDuration[1];
                         }
                         reason = args[0] ? (Number(args).toString().length === args.length ? autosanctionMessages[Number(args) - 1] : args[0].toUpperCase() + args.slice(1)) : null;
                         return msg.force(cmdsCId, `${testing ? '' : '-'}ban ${user}${duration ? ` -d ${duration}` : ''}${reason ? ` ${reason}` : ' No reason provided.'}`);
                     }
                 },
                 class KickCommand extends Command {
                     constructor() {
                         super({
                             name: 'kick',
                             format: '<user> <reason>',
                             hasOne: [permRoles['D'],
                                      permRoles['E'],
                                      permRoles['F'],
                                      permRoles['*']],
                             details: `Here's the list of autoreasons:\n${autosanctionMessages.map((v, i) => `${i + 1}: ${v}`).join('\n\n')}`,
                         });
                     }
             
                     run(msg, args) {
                         var user = args.split(' ')[0];
                         var reason;
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say( "A user must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         reason = args[0] ? (Number(args).toString().length === args.length ? autosanctionMessages[Number(args) - 1] : args[0].toUpperCase() + args.slice(1)) : null;
                         if (!reason) return msg.say("A reason must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         return msg.force(cmdsCId, `${testing ? '' : '-'}kick ${user}${reason ? ` ${reason}` : ' No reason provided.'}`);
                     }
                 },
                 class MuteCommand extends Command {
                     constructor() {
                         super({
                             name: 'mute',
                             format: '<user> [duration] [reason]',
                             details: `Here's the list of autoreasons:\n${autosanctionMessages.map((v, i) => `${i + 1}: ${v}`).join('\n\n')}`,
                             hasOne: [permRoles['C'],
                                      permRoles['D'],
                                      permRoles['E'],
                                      permRoles['F'],
                                      permRoles['*']],
                         });
                     }
             
                     run(msg, args) {
                         let split = args.split(' ');
                         var user = split[0];
                         var duration;
                         var reason;
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say("A user must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         let matchDuration = new RegExp(/(\d{1,4}[hdmy])/i).exec(args);
                         if (matchDuration && args.slice(0, matchDuration[0].length) === matchDuration[0]) {
                             args = args.replace(matchDuration[0], '').trim();
                             duration = matchDuration[1];
                         }
                         reason = args[0] ? (Number(args).toString().length === args.length ? autosanctionMessages[Number(args) - 1] : args[0].toUpperCase() + args.slice(1)) : null;
                         return msg.force(cmdsCId, `${testing ? '' : '-'}mute ${user}${duration ? ` ${duration}` : ''}${reason ? ` ${reason}` : ' No reason provided.'}`);
                     }
                 },
                 class UnmuteCommand extends Command {
                     constructor() {
                         super({
                             name: 'unmute',
                             format: '<user> <reason>',
                             hasOne: [permRoles['C'],
                                      permRoles['D'],
                                      permRoles['E'],
                                      permRoles['F'],
                                      permRoles['*']],
                         });
                     }
             
                     run(msg, args) {
                         var user = args.split(' ')[0];
                         var reason;
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say("A user must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         reason = args[0] ? args[0].toUpperCase() + args.slice(1) : null;
                         if (!reason) return msg.say("A reason must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         return msg.force(cmdsCId, `${testing ? '' : '-'}unmute ${user}${reason ? ` ${reason}` : ' Unmute'}`);
                     }
                 },
                 class WarnCommand extends Command {
                     constructor() {
                         super({
                             name: 'warn',
                             format: '<user> <reason>',
                             details: `Here's the list of autoreasons:\n${autosanctionMessages.map((v, i) => `${i + 1}: ${v}`).join('\n\n')}`,
                             hasOne: [permRoles['B'],
                                      permRoles['C'],
                                      permRoles['D'],
                                      permRoles['E'],
                                      permRoles['F'],
                                      permRoles['*']],
                         });
                     }
             
                     run(msg, args) {
                         var user = args.split(' ')[0];
                         var reason;
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say("A user must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         reason = args[0] ? (Number(args).toString().length === args.length ? autosanctionMessages[Number(args) - 1] : args[0].toUpperCase() + args.slice(1)) : null;
                         if (!reason) return msg.say("A reason must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         return msg.force(cmdsCId, `${testing ? '' : '-'}warn ${user}${reason ? ` ${reason}` : ' No reason provided.'}`);
                     }
                 },
                 class VerifyCommand extends Command {
                     constructor() {
                         super({
                             name: 'verify',
                             format: '<user>',
                             aliases: ['v']
                         });
                     }
             
                     run(msg, args) {
                         var user = args.split(' ')[0];
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say("A user must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         return msg.force(cmdsCId, `${testing ? '' : '!'}v ${user}`);
                     }
                 },
                 class EvalCommand extends Command {
                     constructor() {
                         super({
                             name: 'eval',
                             format: '<script>',
                             hidden: true,
                         });
                     }
             
                     run(msg, args) {
                         if (!testing) return msg.say('Woah, you shouldn\'t be using this command.');
                         let script = args;
                         try {
                             let result = eval(script);
                             BdApi.alert(JSON.stringify(result));
                         } catch(e) {
                             BdApi.alert('Error', `${e.name}: ${e.message}`);
                         }
                         return null;
                     }
                 },
                 class HelpCommand extends Command {
                     constructor() {
                         super({
                             name: 'help',
                             format: '[command]',
                             description: 'This.',
                         });
                     }
             
                     run(msg, args) {
                         let cmdName = args.toLowerCase();
                         let commands = registry.commands;
                         if (cmdName) {
                             // Find the command
                             let cmd = (function () {
                                 let cmds = [];
                                 for (var i in commands) {
                                     let cmd = commands[i];
                                     if (i === cmd.name && 0 == cmd.hidden && i.includes(cmdName)) cmds.push(cmd);
                                 };
                                 if (cmds.length === 0) return null;
                                 if (cmds.length === 1) return cmds[0];
                                 let cmd = commands[cmdName];
                                 if (cmd) return cmd;
                                 if (cmds.length > 1) return `Multiple commands found. Please be more specific.`;
                                 else return null;
                             }())
                             if (typeof cmd === 'string') return msg.say(cmd);
                             if (!(cmd instanceof Command)) return msg.say('Command not found.');
                             return msg.say(`\`${prefix}${cmd.name}${cmd.format ? ' ' + cmd.format : ''}\`${
                                 cmd.description ? '\n' + cmd.description : ''
                             }${
                                 cmd.aliases ? `\nAliases: ${cmd.aliases.map(v => '`' + v + '`')}` : ''
                             }${
                                 cmd.examples ? `\nExamples: ${cmd.examples.map(v => '`' + v + '`').join(', ')}` : ''
                             }${
                                 cmd.details ? '\n```'+ cmd.details + '```' : ''
                             }`)
                         } else {
                             let cmds = [];
                             for (var i in commands) {
                                 let cmd = commands[i];
                                 // Skip over aliased commands
                                 if (i === cmd.name && 0 == cmd.hidden) cmds.push(cmd);
                             };
                             cmds.sort(r => r.name)
                             return msg.say(`Use \`${prefix}help command\` for more info.\n${cmds.map(r => `\`${r.isUsable(msg) ? '' : '[x] '}${r.name}\``).join('\n')}`)
                         };
                     }
                 },
                 class OriginCommand extends Command {
                     constructor() {
                         super({
                             name: 'origin',
                             format: '<user>',
                             description: 'Get origin information of a user.',
                         });
                     }
             
                     async run(msg, args) {
                         var user = args.split(' ')[0];
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say("A user must be supplied! " + `${prefix}${this.name} ${this.format}`)
                         let userData = (await new APIRequest('user/'+user)).data.data;
                         console.log(userData)
                         if (!userData) return msg.say('Unable to find user data.');
                         if (!userData.invitesUsed) return msg.say('This user has no invite history.');
                         let invArray = [];
                         for (var i in userData.invitesUsed) {
                             let obj = userData.invitesUsed[i];
                             obj.code = i;
                             invArray.push(obj)
                         };
                         let originInvite = APIFunctions._getOriginInvite(invArray);
                         let originJoin = APIFunctions._getOriginJoinDate(invArray);
                         let msgs = [`<@!${user}> originally joined via \`${originInvite ? originInvite.code : 'unknown'}\` at ${originJoin ? new Date(originJoin) : 'unknown'}.`];
                         return msg.say(msgs.join('\n') || 'Nothing found.')
                     }
                 },
                 class RevokeCommand extends Command {
                     constructor() {
                         super({
                             name: 'revoke',
                             format: '<invite> [reason]',
                             description: 'Revokes an invite.',
                             hasOne: [permRoles['*']],
                         });
                     }
             
                     async run(msg, args) {
                         var invite = args.split(' ')[0].replace(/[\\\/]/g, '');
                         args = args.replace(invite, '').trim();
                         var reason = args[0] ? args[0].toUpperCase() + args.slice(1) : null;
                         let resp = (await new APIRequest('invite/'+invite+'/revoke', {
                             query: {
                                 reason: reason
                             }
                         })).data;
                         if (!resp.success || !resp.data) {
                             if (resp.message) return msg.say('Request failed with message: ' + resp.message);
                             return msg.say('Request failed of unknown origin.');
                         };
                         console.log(resp);
                         return msg.say(`Successfully deleted \`${resp.data.code}\` for \`\`\`${resp.data.reason || 'No reason added'}\`\`\``);
                     }
                 },
                 class RoleCommand extends Command {
                     constructor() {
                         super({
                             name: 'role',
                             format: '<user> <role>',
                             hasOne: [permRoles['F'],
                                      permRoles['*']],
                         });
                     }
             
                     run(msg, args) {
                         var user = args.split(' ')[0];
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say( "A user must be supplied! " + `${prefix}${this.name} ${this.format}`);
                         var role = args;
                         if (role.length === 0) return msg.say( "A role must be supplied! " + `${prefix}${this.name} ${this.format}`);
                         return msg.force(huCmdsCId, `${testing ? '' : '!'}role ${user} ${role}`);
                     }
                 },
                 class AutoWelcomeCommand extends Command {
                     constructor() {
                         super({
                             name: 'autowelcome',
                             format: '<user> <number>',
                             aliases: ['aw'],
                             formats: [
                                 'Welcome to The Furry Refuge, {{user}}!',
                                 'Welcome to The Furry Refuge, we hope you have a great stay. {{user}}',
                                 'Welcome {{user}}, make sure to select some roles from <#645783730559909908> and read the <#725856136065974322> for more information.',
                                 'Thanks for popping in, {{user}}, we hope you have a great time in The Furry Refuge.\nIn the meantime, try getting some roles <#645783730559909908> and saying "Hello"!',
                                 'Who\'s there? Oh, it\'s just you, {{user}}! Get started by getting some freebie roles from <#645783730559909908>.',
                                 'Amazing of you to pop in, {{user}}. Enjoy your stay and make some best buddies! Get some roles from <#645783730559909908> to get access to the rest of the server :P'
                             ],
                             details: `Here's the list of automessages:\n${autowelcomeMessages.map((v, i) => `${i + 1}: ${v}`).join('\n\n')}`,
                         });
                     }
             
                     run(msg, args) {
                         var user = args.split(' ')[0];
                         let match = new RegExp(/@([\S\s]{2,32})#(\d{4})/).exec(args);
                         if (match) {
                             args = args.replace(match[0], '').trim();
                             let find = ZLibrary.DiscordModules.UserStore.findByTag(match[1], match[2]);
                             if (find) user = find.id;
                         } else {
                             args = args.replace(user, '').trim();
                         }
                         if (user.length === 0 || (user.replace(/\D*/g, '').length !== user.length)) return msg.say("A user must be supplied! " + `${prefix}${this.name} ${this.format}`);
                         var number = args.split(' ')[0];
                         if (!number) return msg.say("A number must be supplied! " + `${prefix}${this.name} ${this.format}`);
                         let format = autowelcomeMessages[Number(number) - 1];
                         if (!format) return msg.say('I couldn\'t find that autowelcome message.');
                         return msg.force(BDFDB.LibraryModules.LastChannelStore.getChannelId(), format.replace(/{{user}}/g, `<@!${user}>`));
                     }
                 },
             ]
             
             // I know it's janky, but this part doesn't need to be complex
             for (var i in _args) {
                 let type = new _args[i]();
                 registry.types[type.id] = type;
             };
             for (var i in _commands) {
                 let cmd = new _commands[i]();
                 registry.commands[cmd.name] = cmd;
                 if (cmd.aliases) cmd.aliases.forEach(a => {
                     registry.commands[a] = cmd;
                 })
             };
             
             return {
                 registry,
                 FriendlyError,
                 CommandFormatError,
                 Command,
                 VirtualMessage,
                 CommandMessage,
                 Argument,
                 ArgumentCollector,
                 ArgumentType,
                 ArgumentUnionType,
                 Util,
                 APIRequest
             }
             }
         var settings = {};
         var inputs = {};
         var amounts = {};
         var cache = {
             users: {},
             invites: {},
         };
         var prefix = '.';
         var token = '';
         let baseURL = 'https://api2.paw.bot';
         
         var testing = false;
         if (testing) {
             cmdsCId = '645783809492779052';
         }
         const {
             registry,
             VirtualMessage,
             Command,
             CommandMessage,
             Util,
             APIRequest
         } = LoadClasses(BDFDB);
         // console.log(new VirtualMessage('645783743423840277', 'har', {
         //     author: {
         //         id: '291656468493631488'
         //     }
         // }))
         
         return class ATFRModerator extends Plugin {
             onLoad() {
                 // console.log(config.info.name, 'Mini load')
                 this.defaults = {
                     settings: {
                         hideUnknownCommands:	{value: true, 	description: "Unknown commands will not get sent"},
                         inviteInUserPopout: 	{value: true, 	description: "Show invite in user popout", note: "Deprecated", disabled: true},
                         debug: 	                {value: false, 	description: "Debug mode", note: "Disables dangerous commands and enables quick eval"},
                     },
                     inputs: {
                         prefix:			{value: '.',   placeholder: '!',          	description: "Prefix for local commands"},
                         token:			{value: '',      placeholder: 'SecretToken', 	description: "Your token for api.paw.bot"}
                     },
                     amounts: {
                         live:			{value: 60,  min: 0, max: 60, placeholder: 60,	description: "How long system messages can live for", note: "In seconds, 0 = doesn't expire."},
                     },
                 };
                 
                 this.patchedModules = {
                     after: {
                         UserPopout: "render",
                         AnalyticsContext: "render",
                     }
                 };
                 
             }
             
             onStart() {
                 // console.log(config.info.name, 'Mini start')
                 this.forceUpdateAll();
                 this.attachHandler()
             }
             
             onStop() {
                 // console.log(config.info.name, 'Mini stop')
                 this.forceUpdateAll();
             }
 
             getSettingsPanel (collapseStates = {}) {
                 // console.log(config.info.name, 'Getting settings panel')
                 let settingsPanel, settingsItems = [];
                 for (let key in inputs) settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
                     type: "TextInput",
                     plugin: this,
                     disabled: this.defaults.inputs[key].disabled,
                     keys: ["inputs", key],
                     label: this.defaults.inputs[key].description,
                     note: this.defaults.inputs[key].note,
                     placeholder: this.defaults.inputs[key].placeholder,
                     value: !(inputs[key] === '') ? inputs[key] : this.defaults.inputs[key].value,
                 }));
 
                 for (let key in settings) settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
                     type: "Switch",
                     plugin: this,
                     disabled: this.defaults.settings[key].disabled,
                     keys: ["settings", key],
                     label: this.defaults.settings[key].description,
                     note: this.defaults.settings[key].note,
                     placeholder: this.defaults.settings[key].placeholder,
                     value: settings[key]
                 }));
                 
                 for (let key in amounts) settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
                     type: "TextInput",
                     plugin: this,
                     disabled: this.defaults.amounts[key].disabled,
                     childProps: {
                         type: "number"
                     },
                     keys: ["amounts", key],
                     label: this.defaults.amounts[key].description,
                     note: this.defaults.amounts[key].note,
                     min: this.defaults.amounts[key].min,
                     max: this.defaults.amounts[key].max,
                     placeholder: this.defaults.amounts[key].placeholder,
                     value: !(amounts[key] === '') ? amounts[key] : this.defaults.amounts[key].value,
                 }));
                 
                 return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, settingsItems);
             }
 
             onSettingsClosed (e) {
                 // console.log(config.info.name, 'Settings closed')
                 if (this.SettingsUpdated) {
                     delete this.SettingsUpdated;
                     this.forceUpdateAll();
                 }
             }
         
             forceUpdateAll () {
                 // console.log(config.info.name, 'Update all')
                 settings = BDFDB.DataUtils.get(this, "settings");
                 inputs = BDFDB.DataUtils.get(this, "inputs");
                 amounts = BDFDB.DataUtils.get(this, "amounts");
                 if (inputs.prefix.length > 10) inputs.prefix = inputs.prefix.slice(9);
                 if (inputs.prefix == '') inputs.prefix = this.defaults.inputs.prefix.value;
                 if (amounts.live === '') amounts.live = this.defaults.amounts.live.value;
                 if (amounts.live > this.defaults.amounts.live.max) amounts.live = this.defaults.amounts.live.max;
                 if (amounts.live < this.defaults.amounts.live.min) amounts.live = this.defaults.amounts.live.min;
                 inputs.prefix = inputs.prefix.toLowerCase();
                 amounts.live = Math.round(amounts.live);
                 prefix = inputs.prefix;
                 token = inputs.token;
                 console.log('T: ', inputs.token);
                 console.log('O: ', token);
                 testing = settings.debug;
                 // if (token) {
                 //     new APIRequest('users').then(d => cache['users'] = d.data.data);
                 //     new APIRequest('invites').then(d => cache['invites'] = d.data.data);
                 // }
                 
                 BDFDB.PatchUtils.forceAllUpdates(this);
             }
 
             onSwitch(){
                 // console.log(config.info.name, 'Switch')
                 this.attachHandler()
             }
             
             // processUserPopout (e) {
             // 	if (e.instance.props.user && settings.inviteInUserPopout && token) {
             // 		let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {name: "CustomStatus"});
             // 		if (index > -1) this.injectInvite(children, 2, e.instance.props.user);
             // 	}
             // }
 
             // processAnalyticsContext (e) {
             // 	if (typeof e.returnvalue.props.children == "function" && e.instance.props.section == BDFDB.DiscordConstants.AnalyticsSections.PROFILE_MODAL && settings.addInUserProfil) {
             // 		let renderChildren = e.returnvalue.props.children;
             // 		e.returnvalue.props.children = (...args) => {
             // 			let renderedChildren = renderChildren(...args);
             // 			let [children, index] = BDFDB.ReactUtils.findParent(renderedChildren, {name: ["DiscordTag", "ColoredFluxTag"]});
             // 			if (index > -1) this.injectInvite(children, 1, children[index].props.user);
             // 			return renderedChildren;
             // 		};
             // 	}
             // }
             
             // injectInvite (children, index, user) {
             //     if (!cache[user.id] || !cache[user.id].inviteUsed) new APIRequest('user/' + user.id).then(req => {
             //         let data = req.data.data;
             //         if (!data || !data.inviteUsed) return;
             //         if (!cache[user.id]) cache[user.id] = {};
             //         cache[user.id].inviteUsed = data.inviteUsed;
             //         console.log(user)
             //         children.splice(index, 0, BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextScroller, {
             //             className: BDFDB.disCNS._creationdatedate + BDFDB.disCNS.userinfodate + BDFDB.disCN.textrow,
             //             children: data.inviteUsed,
             //         }));
             //     })
             //     if (cache[user.id] && cache[user.id].inviteUsed) {
             //         children.splice(index, 0, BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextScroller, {
             //             className: BDFDB.disCNS._creationdatedate + BDFDB.disCNS.userinfodate + BDFDB.disCN.textrow,
             //             children: cache[user.id].inviteUsed,
             //         }));
             //     }
             // }
             
             injectInvite(children, index, user) {
                 new APIRequest('user/' + user.id).then(d => { if (!cache.users[user.id]) cache.users[user.id] = {}; cache.users[user.id] = d.data.data; });
                 if (cache.users[user.id] && cache.users[user.id].inviteUsed) children.splice(index, 0, BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.TextScroller, {
                     className: BDFDB.disCNS._creationdatedate + BDFDB.disCNS.userinfodate + BDFDB.disCN.textrow,
                     children: cache.users[user.id].inviteUsed,
                 }));
             };
             
             attachHandler () {
                 // console.log(config.info.name, 'Attaching handler')
                 // let textarea = ZLibrary.DiscordClassModules.Textarea.textArea
                 var textarea = document.querySelector(`.${ZLibrary.WebpackModules.getByProps('markup').markup.split(" ").join(".")}` + `.${ZLibrary.WebpackModules.getByProps('slateTextArea').slateTextArea.split(" ").join(".")}`);
                 // let textarea = ZLibrary.ReactTools.getOwnerInstance(document.querySelector(`.${ZLibrary.WebpackModules.getByProps('markup').markup.split(" ").join(".")}`+ZLibrary.DiscordSelectors.Textarea.textAreaSlate.value));
                 // console.log(textarea)
                 // let chatform = BDFDB.DOMUtils.getParent(BDFDB.dotCN.chatform, document.querySelector('.'+textarea));
                 // let instance = BDFDB.ReactUtils.findOwner(chatform, {name: "ChannelTextAreaForm"}) || BDFDB.ReactUtils.findOwner(chatform, {name: "ChannelTextAreaForm", up: true});
                 // console.log($(textarea).prevObject)
                 // console.log(instance)
                 if(!textarea) textarea = document.querySelector('.channelTextArea-2VhZ6z textarea');
                 if(!textarea) return console.error(config.info.name, 'Unable to find textarea');
                 // if($(textarea).length === 0) return console.error(config.info.name, 'Unable to find textarea via jquery');
                 textarea.addEventListener("keydown", function(e){
                     let instance = BDFDB.ReactUtils.findOwner(textarea, {name: "ChannelTextAreaForm"}) || BDFDB.ReactUtils.findOwner(textarea, {name: "ChannelTextAreaForm", up: true});
                     if (!instance) return console.error(config.info.name, 'Unable to find channel text area form')
                     var code = e.keyCode || e.which;
                     // Return if input was not Enter or the autocomplete is visible
                     // console.log(config.info.name, 'Message being typed')
                     // console.log(this)
                     // if (code !== 13 || $('.autocomplete-1vrmpx').is(':visible')) return;
                     if (code !== 13 || document.querySelector('.autocomplete-1vrmpx')) return;
                     var text = instance.state.textValue;
                     // console.log(config.info.name, 'Message sent', text)
 
                     if (text.toLowerCase().startsWith(prefix.toLowerCase())) {
                         // console.log(config.info.name, 'Message is command')
                         var hidden = false;
                         let commands = registry.commands;
                         let hide = () => {
                             // console.log(config.info.name, 'Stopping real message')
                             hidden = true;
                             e.preventDefault(); // Stop the message being sent
                             // e.stopPropagation();
                             // $(this).val(''); // Set the textbox empty
                             let chatform = textarea
                             if (chatform) {
                                 // console.log(config.info.name, 'Deleting chatform draft')
                                 // Delete the draft, as Discord would put the text back after reloading
                                 let instance = BDFDB.ReactUtils.findOwner(chatform, {name: "ChannelTextAreaForm"}) || BDFDB.ReactUtils.findOwner(chatform, {name: "ChannelTextAreaForm", up: true});
                                 if (instance) instance.setState({textValue: "", richValue: BDFDB.LibraryModules.SlateUtils.deserialize("")});
                             }
                         }
                         if (settings.hideUnknownCommands) hide();
                         // Validate the command
 
                         // Prep the user-defined prefix
                         const escapedPrefix = prefix.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
                         // Create patterns for easy matching
                         let pattern    = new RegExp(`^(${escapedPrefix}\\s*)([^\\s]+)`, 'i'),
                             patternDbl = new RegExp(`^(${escapedPrefix}\\s*)([^\\s]+)\\s([^\\s]+)`, 'i');
                         const matchesDbl = patternDbl.exec(text);
                         let command, argString;
                         if (matchesDbl) {
                             command = commands[matchesDbl[2] + ' ' + matchesDbl[3]];
                             if (command) argString = text.substring(matchesDbl[1].length + (matchesDbl[2] ? matchesDbl[2].length : 0) + (matchesDbl[3] ? matchesDbl[3].length + 1 : 0));
                         }
                         const matches = pattern.exec(text);
                         if (matches) {
                             command = commands[matches[2]];
                             if (command) argString = text.substring(matches[1].length + (matches[2] ? matches[2].length + 1 : 0));
                         }
                         if (command) {
                             if (!hidden) hide();
 
                             // Prep the command and run
                             try {
                                 // console.log(config.info.name, 'Executing command')
                                 return new CommandMessage(new VirtualMessage(BDFDB.LibraryModules.LastChannelStore.getChannelId(), text, {
                                     author: ZLibrary.DiscordModules.UserStore.getCurrentUser()
                                 }), command, argString).run().catch(e => BdApi.alert('Error', `${e.name || 'Unknown Error'}: ${e.message || 'No message'}`));
                             } catch(e) {
                                 // console.log(config.info.name, 'Command error\'d out of bounds')
                                 new VirtualMessage(BDFDB.LibraryModules.LastChannelStore.getChannelId(), `Whoops, I have encountered an error while running that command.\nCheck console for more information.\n\`\`\`${e.name || 'Unknown Error'}: ${e.message || 'No Message'}\`\`\``).send();
                                 return console.error(config.info.name, e);
                             };
                         }
                         // console.log(config.info.name, 'Cannot find command')
                         return new VirtualMessage(BDFDB.LibraryModules.LastChannelStore.getChannelId(), `Command not found. Try \`${prefix}help\`.`).send()
                     }
                 })
             }
         };
     })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
 })();