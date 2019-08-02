# Houston

CLI for dummies (like me)

## Download
[Download Houston Installer](https://github.com/MarvinZeising/Houston/raw/master/dist/Houston%20Setup%200.1.0.exe)

## Config
Easily configurable via a config file (`~/houston.config`) that has to look like this (_all arguments are optional_):

```json
{
  "pushedKey": "<your appKey for pushed.co>",
  "pushedSecret": "<your appSecret for pushed.co>",
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
              "type": "definite",
              "command": "./compile.sh; ./run.sh;"
            }
          ]
        }
      ]
    }
  ]
}
```

## Notes
- The `library` is an array of strings. It will be contatenated (separated by spaces) and run before the actual command of the task.
- Possible task types: `definite`, `definiteWithNotifications`, `continuous`
- If `pushedKey` and `pushedSecret` is provided, Houston will send notifications for tasks with the type `definiteWithNotifications` after they're succeeded or failed.

## Screenshots

![houston-1](https://github.com/MarvinZeising/Houston/raw/master/public/houston-1.jpg)

![houston-2](https://github.com/MarvinZeising/Houston/raw/master/public/houston-2.jpg)
