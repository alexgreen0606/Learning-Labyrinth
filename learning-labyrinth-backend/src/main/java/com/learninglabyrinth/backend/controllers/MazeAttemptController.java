package com.learninglabyrinth.backend.controllers;

import java.util.List;
import java.util.UUID;

import com.learninglabyrinth.backend.services.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.learninglabyrinth.backend.dto.UserCode;
import com.learninglabyrinth.backend.models.MazeAttempt;
import com.learninglabyrinth.backend.services.MazeAttemptService;

/**
 * Manage MazeAttempt objects (models)
 * 
 * @author Mary Kim
 */
@RestController
@RequestMapping("/mazeAttempt")
@CrossOrigin
public class MazeAttemptController {
  private final MazeAttemptService service;

  public MazeAttemptController(MazeAttemptService service) {
    this.service = service;
  }

  /**
   * Get all the user's maze attempts.
   */
  @GetMapping("/getMazeAttempts")
  public List<MazeAttempt> getMazeAttempts() {
    try {
      return service.getMazeAttempts();
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
    }
  }

  @GetMapping("/best")
  public MazeAttempt getBestMazeAttempt(@RequestParam UUID userToken, @RequestParam Long mazeId) {
    if (!AccountService.hashMap.containsKey(userToken)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is currently no logged-in user with the provided token (" + userToken.toString() + ")");
    }

    try {
      MazeAttempt bestAttempt = service.findBest(mazeId, AccountService.hashMap.get(userToken).id);
      return bestAttempt;
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.OK, "No best or most recent attempt exists for the requested user.");
    }
  }

  @GetMapping("/mostRecent")
  public MazeAttempt getMostRecentMazeAttempt(@RequestParam UUID userToken, @RequestParam Long mazeId) {
    if (!AccountService.hashMap.containsKey(userToken)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There is currently no logged-in user with the provided token (" + userToken.toString() + ")");
    }

    try {
      return service.findMostRecent(mazeId, AccountService.hashMap.get(userToken).id);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.OK, "No attempt exists for the requested user.");
    }
  }

  /**
   * Run the given Java text to complete the maze.
   */
  @PostMapping("/attemptMaze")
  public MazeAttempt createMazeAttempt(@RequestParam UUID token,
                                       @RequestParam Long mazeId,
                                       @RequestBody UserCode userCode) {
    try {
      return service.createMazeAttempt(token, mazeId, userCode.userCode, true);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
    }
  }
  
  /**
   * Run the given java text to complete the maze, but do not save the attempt
   * to the database.
   */
  @PostMapping("/testAttempt")
  public MazeAttempt testAttempt(@RequestParam UUID token,
                                 @RequestParam Long mazeId,
                                 @RequestBody UserCode userCode) {
    try {
      return service.createMazeAttempt(token, mazeId, userCode.userCode, false);
    }
    catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
    }
  }
}
