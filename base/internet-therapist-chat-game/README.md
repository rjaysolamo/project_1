# Internet Therapist Chat Game

An interactive therapeutic chat game powered by Venice AI for mental wellness and self-reflection.

## Features

- 🤖 **AI-Powered Therapy**: Real therapeutic conversations using Venice AI's privacy-first LLM
- 💬 **Interactive Chat Interface**: Clean, responsive chat UI with typing indicators
- 🔒 **Privacy-First**: Built with Venice AI's privacy-focused architecture
- 🎨 **Modern UI**: Beautiful interface built with Next.js and Tailwind CSS
- ⚡ **Real-time Responses**: Fast, contextual AI responses for therapeutic conversations

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd internet-therapist-chat-game
npm install
```

### 2. Venice AI Configuration

1. **Get your Venice AI API key**:
   - Visit [Venice AI](https://venice.ai)
   - Sign up for an account
   - Generate an API key from your dashboard

2. **Configure the environment**:
   ```bash
   # For development
   # Edit .env and add your API key
   NEXT_PUBLIC_VENICE_AI_API_KEY=your_actual_api_key_here
   
   # For production
   # Edit .env.production and add your API key
   NEXT_PUBLIC_VENICE_AI_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Application

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to start your therapeutic chat session.

## Venice AI Integration

This application uses Venice AI's privacy-first API for therapeutic conversations:

- **Model**: `llama-3.1-8b-instruct` - Optimized for conversational AI
- **Privacy**: No data storage or training on user conversations
- **OpenAI Compatible**: Uses standard OpenAI API format
- **Therapeutic Prompting**: Custom system prompts for therapeutic responses

### API Features Used

- Chat completions with conversation history
- Therapeutic system prompting
- Error handling and fallback responses
- API key validation

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ChatInterface.tsx    # Main chat component
│   │   ├── ChatMessage.tsx      # Individual message display
│   │   └── ChatInput.tsx        # Message input component
│   ├── services/
│   │   └── veniceAI.ts          # Venice AI integration
│   ├── types/
│   │   └── chat.ts              # TypeScript interfaces
│   ├── layout.tsx               # App layout
│   └── page.tsx                 # Main page
└── ...
```

## Development

### Adding New Features

1. Update the todo list in `todo.md`
2. Implement features following TypeScript best practices
3. Test with Venice AI integration
4. Update documentation

### Environment Variables

- `NEXT_PUBLIC_VENICE_AI_API_KEY`: Your Venice AI API key
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Application version

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

- Ensure environment variables are configured
- Run `npm run build` for production build
- Serve the `out` directory

## Security & Privacy

- Venice AI ensures no data storage or model training on conversations
- API keys are handled securely through environment variables
- All conversations are ephemeral and privacy-focused
- No user data persistence in the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the coding guidelines
4. Test with Venice AI integration
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For Venice AI API issues, visit [Venice AI Documentation](https://docs.venice.ai)
For application issues, create an issue in this repository.
