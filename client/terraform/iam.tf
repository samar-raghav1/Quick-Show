resource "aws_iam_policy_document" "eks_assume" {
    statement {
        actions =["sts:AssumeRole"]
        principals {
            type ="Service"
            identifiers = ["ec2.amazonaws.com"]
        }
    }
}
resource "aws_iam_policy_document" "eks_node_assume" {
    statement {
        actions= ["sts:AssumeRole"]
        principals {
            type ="Service"
            identifiers = ["ec2.amazonaws.com"]
        }
    }
}

resource "aws_iam_role" "eks_role" {
    name = "eksClusterRole"
    assume_role_policy = data.aws_iam_policy_document.eks_assume.json

}
resource "aws_iam_role" "eks_node_role" {
    name = "eksNodeRole"
    assume_role_policy = data.aws_iam_policy_document.eks_node_assume.json

}

resource "aws_iam_policy_attachment" "eks_cluster_attach" {
    name = "eksClusterAttach"
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}
resource "aws_iam_policy_attachment" "eks_node_attach" {
    name = "eksNodeAttach"
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}
resource "aws_iam_policy_attachment" "eks_node_ecr_attach" {
    name = "eksECRAttach"
    policy_arn = "arn:aws:iam::aws:policy/AmazonEKSContainerRegistryReadOnly"
}

output "eks_cluster_role_arn" {
  value = aws_iam_role.eks_role.arn
}

output "eks_node_role_arn" {
  value = aws_iam_role.eks_node_role.arn
}
