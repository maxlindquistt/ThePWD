<memory-app>
A web component that represents a memory game, allowing users to flip cards and match pairs to improve memory skills.

## Attributes

### moves
Tracks the number of moves made by the user.  
Default value: 0

### time
Tracks the elapsed time since the game started.  
Default value: 0


## Events

| Event Name    | Fired When                        |
|---------------|-----------------------------------|
| gamewin       | All pairs have been matched       |
| restart       | The game is restarted by the user |

## Example

```html
<memory-app pairs="10"></memory-app>
```
