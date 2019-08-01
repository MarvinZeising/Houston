# Houston

CLI for dummies (like me)

Easily configurable via a config file (`~/houston.config`) that has to look like this:

```json
{
  "library": [
    "function myAwesomeCommand {",
    "  ./doSpecialStuff.sh",
    "}"
  ],
  "repositories": [
    {
      "name": "My-awesome-repository",
      "path": "\\path\\to\\repo",
      "categories": [
        {
          "name": "Compile tasks",
          "tasks": [
            {
              "name": "Compile and run",
              "color": "primary",
              "type": "definiteWithNotification",
              "command": "./compile.sh; ./run.sh;"
            }
          ]
        }
      ]
    }
  ]
}
```

Can send notifications via PushBullet when a task is done.

[Download Houston Installer](https://github.com/MarvinZeising/Houston/raw/master/dist/Houston%20Setup%200.1.0.exe)

# What it looks like

![houston-1](https://github.com/MarvinZeising/Houston/raw/master/public/houston-1.jpg)

![houston-2](https://github.com/MarvinZeising/Houston/raw/master/public/houston-2.jpg)
