package com.learninglabyrinth.backend.runner;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

/**
 * Dynamically loads and compiles Java code at runtime.
 */
public class UserClassLoader extends ClassLoader {

  /**
   * Loads a class from a provided name and code string.
   *
   * @param name: The name of the class (e.g., "UserCode").
   * @param code: The Java source code of the class.
   * @return The loaded class.
   * @throws ClassNotFoundException: If the class cannot be found or loaded.
   */
  public Class<?> loadClass(String name, String code) throws ClassNotFoundException {
    byte[] byteCode = compileCode(name, code);
    return defineClass(name, byteCode, 0, byteCode.length);
  }

  /**
   * Compiles the provided Java source code and returns the compiled byte code.
   *
   * @param name: The name of the class (e.g., "UserCode").
   * @param code: The Java source code of the class.
   * @return The compiled byte code.
   */
  private byte[] compileCode(String name, String code) {
    String tempDir = System.getProperty("java.io.tmpdir");
    Path sourcePath = null;
    try {
      // Create the source file path with the correct name
      Path sourcePathDir = Files.createTempDirectory(Path.of(tempDir), "src");
      sourcePath = Files.createFile(sourcePathDir.resolve(name + ".java"));
      Files.write(sourcePath, code.getBytes());

      // Compile the code using Java Compiler API
      JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
      if (compiler == null) {
        throw new RuntimeException("Java Compiler not available.");
      }
      int compilationResult = compiler.run(null, null, null, "-d", tempDir, sourcePath.toString());
      if (compilationResult != 0) {
        throw new RuntimeException("Compilation failed");
      }

      // Load the compiled class file
      Path classFilePath = Path.of(tempDir, name + ".class");

      return Files.readAllBytes(classFilePath);
    } catch (IOException e) {
      throw new RuntimeException("Error handling I/O operations", e);
    } finally {
      if (sourcePath != null) {
        // Clean up temporary files
        try {
          Files.deleteIfExists(sourcePath);
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }
}
