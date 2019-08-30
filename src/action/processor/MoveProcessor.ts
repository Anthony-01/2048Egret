namespace game {
    export class MoveProcessor implements IActionProcessor {
        assertAction(command: IActionCommand, host: IGameHost): boolean {
            return
        }
        applyAction(command: IActionCommand, host: IGameHost) {
            host.m_grid
        }
    }
}