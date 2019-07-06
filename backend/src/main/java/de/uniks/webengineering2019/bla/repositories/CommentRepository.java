package de.uniks.webengineering2019.bla.repositories;

import de.uniks.webengineering2019.bla.model.Comment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CommentRepository extends CrudRepository<Comment, Long> {

}
