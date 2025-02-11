import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GeminiService } from '../../services/gemini.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgClass,
    HttpClientModule,
    MarkdownModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [GeminiService],
})
export class ChatComponent {
  userInput: string = '';
  messages: { text: string; isUser: boolean }[] = [];
  isLoading: boolean = false;

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(private geminiService: GeminiService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ text: this.userInput, isUser: true });
    this.isLoading = true;

    this.geminiService.getChatResponse(this.userInput).subscribe(
      (response: string) => {
        this.isLoading = false;
        this.messages.push({ text: response, isUser: false });
        this.scrollToBottom();
      },
      (error) => {
        this.isLoading = false;
        this.messages.push({
          text: `Error: ${error.message || 'Could not get a response.'}`,
          isUser: false,
        });
        this.scrollToBottom();
      }
    );

    this.userInput = '';
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
