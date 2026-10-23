package creation.matrix;

public interface MatrixAccess {
    int matrix$getFlags();
    void matrix$setFlags(int flags);
    Rotor matrix$getRotor();
    MatrixThermalData matrix$getThermal();
}
