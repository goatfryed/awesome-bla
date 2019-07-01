package de.uniks.webengineering2019.bla.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.Fetch;

import javax.persistence.*;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name="comment")
public class Commentable {

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    public List<Comment> comments;

    @OneToMany(mappedBy = "master", fetch = FetchType.EAGER)
    @JsonIgnore
    public List<Comment> nestedComments;
}
