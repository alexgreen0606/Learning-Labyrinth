package com.learninglabyrinth.backend.runner;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Starts a new process and passes the user's code to it as command line
 * arguments.
 */
public class UserCodeProcess {

  private String userCodeClass;

  /**
   * Starts a new process using ProcessBuilder to run the user's code.
   *
   * @param code       Source code to be compiled and run
   * @param mazeLayout String representation of the maze being attempted
   * @return Output of the user's code execution
   */
  public String startProcess(String code, String mazeLayout) {
    String output = "";

    // Wrap user's code
    userCodeClass = UserCodeWrapper.top + code + UserCodeWrapper.bottom;
    // Double the escaped double quotes to prevent removal by ProcessBuilder
    userCodeClass = userCodeClass.replace("\"", "\"\"");

    // Set the working directory to /app
    ProcessBuilder processBuilder = new ProcessBuilder(
        "java",
        "-jar",
        "user-code-executor-0.0.1-SNAPSHOT.jar",
        mazeLayout,
        userCodeClass);

    // Set the working directory for the process
    processBuilder.directory(new File("/app"));

    // Use a StringBuilder for output
    StringBuilder outputBuilder = new StringBuilder();

    try {
      // Inherit I/O streams from the parent process
      Process process = processBuilder.start();

      // Read the output of the process
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
        String line;
        while ((line = reader.readLine()) != null) {
          outputBuilder.append(line).append(System.lineSeparator());
        }
      }

      // Wait for the process to finish and get the exit code
      int exitCode = process.waitFor();
      System.out.println("Child Process exited with code " + exitCode);

      // Access the captured output
      output = outputBuilder.toString();
    } catch (IOException | InterruptedException e) {
      // Log the exception or print a meaningful error message
      e.printStackTrace();
    }

    return output;
  }
}
