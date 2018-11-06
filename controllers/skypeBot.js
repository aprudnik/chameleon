const { ActivityTypes } = require('botbuilder');
const { DialogSet } = require('botbuilder-dialogs');


var replyText = ""

// State Accessor Properties
const DIALOG_STATE_PROPERTY = 'dialogState';
const USER_PROFILE_PROPERTY = 'userProfileProperty';



class skypeBot {
  /**
   * @param {ConversationState} conversationState property accessor
   * @param {UserState} userState property accessor
   */
  constructor(conversationState, userState) {
    if (!conversationState) throw new Error('Missing parameter.  conversationState is required');
    if (!userState) throw new Error('Missing parameter.  userState is required');

    // Create the property accessors for user and conversation state
    this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);
    this.dialogState = conversationState.createProperty(DIALOG_STATE_PROPERTY);

    // Create top-level dialog(s)
    this.dialogs = new DialogSet(this.dialogState);
    // Add the Greeting dialog to the set

    this.conversationState = conversationState;
    this.userState = userState;
  }


  async onTurn(context, replyText) {
    if (context.activity.type === ActivityTypes.Message) {
      let dialogResult;
      // Create a dialog context
      const dc = await this.dialogs.createContext(context);
      await dc.context.sendActivity(replyText);

    }
  }
}


module.exports = skypeBot;