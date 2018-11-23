const { ActivityTypes } = require('botbuilder');
const { DialogSet } = require('botbuilder-dialogs');



// State Accessor Properties
const DIALOG_STATE_PROPERTY = 'dialogState';


class skypeBot {
  /**
   * @param {ConversationState} conversationState property accessor
   * @param {UserState} userState property accessor
   */
  constructor(conversationState) {
    this.dialogState = conversationState.createProperty(DIALOG_STATE_PROPERTY);
    this.dialogs = new DialogSet(this.dialogState);
    this.conversationState = conversationState;
  
  }


  async onTurn(context, replyText) {
    if (context.activity.type === ActivityTypes.Message) {
      // Create a dialog context
      const dc = await this.dialogs.createContext(context);
      await dc.context.sendActivity(replyText);

    }
  }
}


module.exports = skypeBot;