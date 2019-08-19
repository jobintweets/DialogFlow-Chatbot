import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ApiAiClient} from 'api-ai-javascript';
import { BehaviorSubject } from 'rxjs';
import { Observable , of} from 'rxjs' ;



export class Message {
  constructor(public content: string , public sentBy: string) { }
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }
  // add messge to source
update (msg: Message) {
  this.conversation.next([msg]);
} 
// send and receive messges via DialogFlow
converse (msg: string) {
  const userMessage = new Message( msg , 'user');
   // update the ui
  this.update(userMessage);
  this.client.textRequest(msg)
    .then(res => {
      const speech = res.result.fulfillment.speech;
      const botMessage = new Message(speech , 'bot');
      this.update(botMessage);
  });

}

  talk() {
    this.client.textRequest('who are you!')
    .then(res => console.log(res));
  }
}
