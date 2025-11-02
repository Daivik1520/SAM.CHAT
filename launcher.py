#!/usr/bin/env python3
import subprocess
import sys
import os
import webbrowser
import time
from pathlib import Path

def main():
    # Get the directory where the executable is located
    if getattr(sys, 'frozen', False):
        app_dir = os.path.dirname(sys.executable)
    else:
        app_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Start the Next.js server
    print("Starting SAM.CHAT...")
    
    # Change to app directory
    os.chdir(app_dir)
    
    # Start the server
    try:
        process = subprocess.Popen(
            [sys.executable, '-m', 'http.server', '3000'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a moment for the server to start
        time.sleep(2)
        
        # Open browser
        webbrowser.open('http://localhost:3000')
        
        # Keep the process running
        process.wait()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
